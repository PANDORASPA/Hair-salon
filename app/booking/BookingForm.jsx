'use client'
import { useCallback,useEffect,useState } from 'react'

const conflictMessage='This time has just been booked. Please choose another time.'

export default function BookingForm({services}){
  const [serviceId,setServiceId]=useState('')
  const [date,setDate]=useState('')
  const [slots,setSlots]=useState([])
  const [loading,setLoading]=useState(false)
  const [submitting,setSubmitting]=useState(false)
  const [confirmation,setConfirmation]=useState(null)
  const [error,setError]=useState('')

  const loadAvailability=useCallback(async(selectedServiceId,selectedDate)=>{
    if(!selectedServiceId||!selectedDate){setSlots([]);return}
    setLoading(true)
    setError('')
    try{
      const response=await fetch(`/api/availability?date=${encodeURIComponent(selectedDate)}&serviceId=${encodeURIComponent(selectedServiceId)}`)
      const payload=await response.json()
      if(!response.ok)throw new Error(payload.error||'Availability is temporarily unavailable.')
      setSlots(payload.slots||[])
    }catch(fetchError){
      setError(fetchError.message)
      setSlots([])
    }finally{setLoading(false)}
  },[])

  useEffect(()=>{loadAvailability(serviceId,date)},[serviceId,date,loadAvailability])

  const submit=async(event)=>{
    event.preventDefault()
    if(submitting)return
    const form=event.currentTarget
    const body=Object.fromEntries(new FormData(form))
    setError('')
    setSubmitting(true)
    try{
      const response=await fetch('/api/appointments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
      const payload=await response.json()
      if(!response.ok)throw Object.assign(new Error(response.status===409?conflictMessage:(payload.error||'Unable to request appointment.')),{status:response.status})
      const service=services.find(item=>String(item.id)===String(body.serviceId))
      setConfirmation({reference:payload.appointment.reference,service:service?.name||'Selected service',date:body.date,time:body.time})
      form.reset()
      await loadAvailability(body.serviceId,body.date)
    }catch(submitError){setError(submitError.status===409?conflictMessage:submitError.message)}
    finally{setSubmitting(false)}
  }

  return <>
    <form className="salon-form" onSubmit={submit} aria-busy={submitting}>
      <label>Service<select name="serviceId" required value={serviceId} onChange={event=>setServiceId(event.target.value)}><option value="" disabled>Select a service</option>{services.map(item=><option value={item.id} key={item.id}>{item.name} — {item.price?`£${item.price/100}`:'Free'}</option>)}</select></label>
      <label>Preferred date<input type="date" name="date" min={new Date().toISOString().slice(0,10)} value={date} onChange={event=>setDate(event.target.value)} required/></label>
      <label>Available time<select name="time" required disabled={!slots.length||loading||submitting}><option value="">{loading?'Checking…':slots.length?'Select a time':'Choose service and date first'}</option>{slots.map(slot=><option key={slot}>{slot}</option>)}</select></label>
      <div className="salon-form-row"><label>Your name<input name="name" autoComplete="name" required/></label><label>Phone<input name="phone" autoComplete="tel" required/></label></div>
      <label>Email<input type="email" name="email" autoComplete="email"/></label>
      <label>Notes<textarea name="notes" rows="4" maxLength="2000" placeholder="Tell us about your hair or the result you want"/></label>
      {error?<p className="salon-error" role="alert">{error}</p>:null}
      <button className="salon-button" type="submit" disabled={!slots.length||submitting}>{submitting?'Requesting…':'Request Appointment'}</button>
    </form>
    {confirmation?<dialog className="booking-confirmation" open aria-labelledby="booking-confirmation-title">
      <div className="booking-confirmation-card">
        <p className="booking-confirmation-kicker">Appointment requested</p>
        <h2 id="booking-confirmation-title">Awaiting confirmation</h2>
        <dl><div><dt>Reference</dt><dd>{confirmation.reference}</dd></div><div><dt>Service</dt><dd>{confirmation.service}</dd></div><div><dt>Date</dt><dd>{confirmation.date}</dd></div><div><dt>Time</dt><dd>{confirmation.time}</dd></div></dl>
        <p>We have received your request. Salon Poke will confirm it with you shortly.</p>
        <button className="salon-button" type="button" onClick={()=>setConfirmation(null)}>Done</button>
      </div>
    </dialog>:null}
  </>
}
