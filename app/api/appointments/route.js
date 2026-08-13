import { NextResponse } from 'next/server'
import availabilityModule from '../../../lib/booking/salon-availability'
import validationModule from '../../../lib/validation/salon'
import { getServerClient } from '../../../lib/supabase/server'
import { getServiceClient } from '../../../lib/supabase/service'
import { guardMutationRequest } from '../../../lib/security/request-guards'
const { londonLocalToUtc } = availabilityModule
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
  const auth = getServerClient(), { data:{ user } } = await auth.auth.getUser().catch(() => ({ data:{ user:null } }))
  const startsAt = londonLocalToUtc(input.value.date,input.value.time)
  if (startsAt.getTime() < Date.now()) return NextResponse.json({ error:'Please choose a future time.' },{ status:400 })
  const db = getServiceClient()
  const { data,error } = await db.rpc('create_salon_appointment',{ p_service_id:input.value.serviceId,p_user_id:user?.id || null,p_customer_name:input.value.name,p_customer_phone:input.value.phone,p_customer_email:input.value.email || null,p_starts_at:startsAt.toISOString(),p_customer_notes:input.value.notes || null })
  if (error) return NextResponse.json({ error:error.message.includes('slot_unavailable') ? 'That time is no longer available.' : 'We could not create the appointment.' },{ status:error.message.includes('slot_unavailable') ? 409 : 500 })
  if (!(request.headers.get('content-type') || '').includes('application/json')) return NextResponse.redirect(new URL(`/booking?requested=${encodeURIComponent(data.reference)}`,request.url),303)
  return NextResponse.json({ appointment:data },{ status:201 })
}

export async function GET() {
  const auth = getServerClient(), { data:{ user } } = await auth.auth.getUser()
  if (!user) return NextResponse.json({ error:'Unauthorized' },{ status:401 })
  const { data,error } = await auth.from('appointments').select('*,services(name,price,duration_minutes)').eq('user_id',user.id).order('starts_at',{ ascending:false })
  return error ? NextResponse.json({ error:error.message },{ status:500 }) : NextResponse.json({ appointments:data || [] })
}
