import PageIntro from '../components/PageIntro'
import BookingForm from './BookingForm'
import { getPublicSalonContent } from '../../lib/content/public-content'
import { getServiceClient } from '../../lib/supabase/service'
export const metadata={title:'Book an Appointment'}
export const dynamic='force-dynamic'
export default async function BookingPage(){const db=getServiceClient();const [salon,hoursResult,blocksResult]=await Promise.all([getPublicSalonContent(),db.from('business_hours').select('weekday,is_open').order('weekday'),db.from('blocked_dates').select('starts_on,ends_on,reason').gte('ends_on',new Date().toISOString().slice(0,10)).order('starts_on')]);const services=salon.services.map((item,index)=>({id:item.id||index+1,name:item.name,price:item.pricePence,duration_minutes:item.durationMinutes}));return <><PageIntro eyebrow="Booking" title="Book your appointment"><p>Choose a service and an available time. We will confirm your appointment personally.</p></PageIntro><section className="salon-wrap salon-section"><BookingForm services={services} businessHours={hoursResult.data||[]} blockedDates={blocksResult.data||[]}/></section></>}
