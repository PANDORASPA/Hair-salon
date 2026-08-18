'use client'
import { useCallback,useEffect,useState } from 'react'
import availabilityModule from '../../lib/booking/salon-availability'
const {buildBookingCalendarMonth}=availabilityModule

const conflictMessage='This time has just been booked. Please choose another time.'

const todayISO=()=>new Date().toISOString().slice(0,10)
const shiftMonth=(month,offset)=>{const [year,value]=month.split('-').map(Number),next=new Date(Date.UTC(year,value-1+offset,1));return next.toISOString().slice(0,7)}

export default function BookingForm({services,businessHours=[],blockedDates=[]}){
  const [serviceId,setServiceId]=useState('')
  const [date,setDate]=useState('')
  const [slots,setSlots]=useState([])
  const [loading,setLoading]=useState(false)
  const [submitting,setSubmitting]=useState(false)
  const [confirmation,setConfirmation]=useState(null)
  const [error,setError]=useState('')
  const [calendarMonth,setCalendarMonth]=useState(todayISO().slice(0,7))
  const calendarDays=buildBookingCalendarMonth({month:calendarMonth,today:todayISO(),businessHours,blockedDates})
  const firstWeekday=calendarDays.length?new Date(`${calendarDays[0].date}T12:00:00Z`).getUTCDay():0

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
      <fieldset className="booking-calendar"><legend>Preferred date</legend><div className="booking-calendar-toolbar"><button type="button" aria-label="Previous month" onClick={()=>setCalendarMonth(shiftMonth(calendarMonth,-1))}>‹</button><strong>{new Date(`${calendarMonth}-01T12:00:00Z`).toLocaleDateString('en-GB',{month:'long',year:'numeric',timeZone:'UTC'})}</strong><button type="button" aria-label="Next month" onClick={()=>setCalendarMonth(shiftMonth(calendarMonth,1))}>›</button></div><div className="booking-calendar-weekdays">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day=><span key={day}>{day}</span>)}</div><div className="booking-calendar-days">{Array.from({length:firstWeekday},(_,index)=><span key={`empty-${index}`}/>)}{calendarDays.map(day=><button key={day.date} type="button" disabled={day.disabled} className={`${day.closed?'closed ':''}${date===day.date?'selected':''}`} title={day.reason||undefined} aria-label={`${day.date}${day.reason?` — ${day.reason}`:''}`} onClick={()=>setDate(day.date)}>{day.day}</button>)}</div><p className="booking-calendar-key"><span/>Black dates are closed and unavailable.</p><input type="hidden" name="date" value={date}/></fieldset>
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
