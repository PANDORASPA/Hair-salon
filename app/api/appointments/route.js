import { NextResponse } from 'next/server'
import availabilityModule from '../../../lib/booking/salon-availability'
import validationModule from '../../../lib/validation/salon'
import { getServerClient } from '../../../lib/supabase/server'
import { getServiceClient } from '../../../lib/supabase/service'
import { guardMutationRequest } from '../../../lib/security/request-guards'
const { buildAvailability, londonLocalToUtc, londonDateWindow } = availabilityModule
const { validateAppointmentInput } = validationModule

const readInput = async (request) => {
  const type = request.headers.get('content-type') || ''
  if (type.includes('application/json')) return request.json().catch(() => ({}))
  return Object.fromEntries((await request.formData()).entries())
}

export async function POST(request) {
  const guard = await guardMutationRequest(request,{ rateLimit:{ scope:'salon.appointments',limit:8,windowMs:60_000 } })
  if (guard) return guard
  const input = validateAppointmentInput(await readInput(request))
  if (!input.ok) return NextResponse.json({ error:'Please check the form.', fields:input.errors },{ status:400 })
  const auth = await getServerClient(), { data:{ user } } = await auth.auth.getUser().catch(() => ({ data:{ user:null } }))
  const startsAt = londonLocalToUtc(input.value.date,input.value.time)
  if (startsAt.getTime() < Date.now()) return NextResponse.json({ error:'Please choose a future time.' },{ status:400 })
  const db = getServiceClient()
  const weekday=new Date(`${input.value.date}T12:00:00Z`).getUTCDay(),window=londonDateWindow(input.value.date)
  const [serviceRes,hoursRes,blockRes,appointmentsRes]=await Promise.all([
    db.from('services').select('duration_minutes').eq('id',input.value.serviceId).eq('published',true).eq('enabled',true).maybeSingle(),
    db.from('business_hours').select('*').eq('weekday',weekday).maybeSingle(),
    db.from('blocked_dates').select('id').lte('starts_on',input.value.date).gte('ends_on',input.value.date).limit(1),
    db.from('appointments').select('starts_at,ends_at,status').neq('status','cancelled').gte('starts_at',window.start.toISOString()).lt('starts_at',window.end.toISOString()),
  ])
  const availabilityError=serviceRes.error||hoursRes.error||blockRes.error||appointmentsRes.error
  if(availabilityError||!serviceRes.data)return NextResponse.json({error:'Availability is temporarily unavailable.'},{status:503})
  const slots=buildAvailability({date:input.value.date,durationMinutes:serviceRes.data.duration_minutes,hours:hoursRes.data,blocked:Boolean(blockRes.data?.length),appointments:appointmentsRes.data||[]})
  if(!slots.includes(input.value.time))return NextResponse.json({error:'The requested time is not available.'},{status:409})
  const { data,error } = await db.rpc('create_salon_appointment',{ p_service_id:input.value.serviceId,p_user_id:user?.id || null,p_customer_name:input.value.name,p_customer_phone:input.value.phone,p_customer_email:input.value.email || null,p_starts_at:startsAt.toISOString(),p_customer_notes:input.value.notes || null })
  if (error) return NextResponse.json({ error:error.message.includes('slot_unavailable') ? 'That time is no longer available.' : 'We could not create the appointment.' },{ status:error.message.includes('slot_unavailable') ? 409 : 500 })
  if (!(request.headers.get('content-type') || '').includes('application/json')) return NextResponse.redirect(new URL(`/booking?requested=${encodeURIComponent(data.reference)}`,request.url),303)
  return NextResponse.json({ appointment:data },{ status:201 })
}

export async function GET() {
  const auth = await getServerClient(), { data:{ user } } = await auth.auth.getUser()
  if (!user) return NextResponse.json({ error:'Unauthorized' },{ status:401 })
  const { data,error } = await auth.from('appointments').select('*,services(name,price,duration_minutes)').eq('user_id',user.id).order('starts_at',{ ascending:false })
  return error ? NextResponse.json({ error:error.message },{ status:500 }) : NextResponse.json({ appointments:data || [] })
}
