import { NextResponse } from 'next/server'
import { adminContext,audit,jsonError } from '../../../../lib/admin/salon-api'
import { guardMutationRequest } from '../../../../lib/security/request-guards'

export async function GET(){
  const context=await adminContext()
  if(context.response)return context.response
  const {data,error}=await context.db.from('appointments').select('*,services(name,price,duration_minutes)').order('starts_at',{ascending:false}).limit(500)
  return error?jsonError(error):NextResponse.json({appointments:data||[]})
}

export async function PATCH(request){
  const guard=await guardMutationRequest(request,{rateLimit:{scope:'admin.appointments',limit:60,windowMs:60_000}})
  if(guard)return guard
  const context=await adminContext()
  if(context.response)return context.response
  const body=await request.json(),id=Number(body.id),allowed=['pending','confirmed','completed','cancelled','no_show']
  if(!Number.isSafeInteger(id)||!allowed.includes(body.status))return jsonError('Invalid appointment update.',400)
  let startsAt=null
  if(body.startsAt){const parsed=new Date(body.startsAt);if(Number.isNaN(parsed.getTime()))return jsonError('Invalid start time.',400);startsAt=parsed.toISOString()}
  const {data,error}=await context.db.rpc('update_salon_appointment',{p_appointment_id:id,p_status:body.status,p_admin_notes:String(body.adminNotes||'').slice(0,2000),p_starts_at:startsAt})
  if(error){
    const conflict=error.code==='23P01'||error.message.includes('slot_unavailable')
    return jsonError(conflict?'This time has just been booked. Please choose another time.':error,conflict?409:500)
  }
  await audit(context.db,context.auth.user,'appointment.update','appointments',id,{status:body.status,startsAt})
  return NextResponse.json({appointment:data})
}
