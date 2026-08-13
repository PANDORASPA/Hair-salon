import PageIntro from '../components/PageIntro'
import BookingForm from './BookingForm'
import { getPublicSalonContent } from '../../lib/content/public-content'
export const metadata={title:'Book an Appointment'}
export const dynamic='force-dynamic'
export default async function BookingPage(){const salon=await getPublicSalonContent(),services=salon.services.map((item,index)=>({id:item.id||index+1,name:item.name,price:item.pricePence,duration_minutes:item.durationMinutes}));return <><PageIntro eyebrow="Booking" title="Book your appointment"><p>Choose a service and an available time. We will confirm your appointment personally.</p></PageIntro><section className="salon-wrap salon-section"><BookingForm services={services}/></section></>}
