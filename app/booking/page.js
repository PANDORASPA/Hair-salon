import PageIntro from '../components/PageIntro'
import BookingForm from './BookingForm'
import defaultsModule from '../../content/salon-poke-defaults'
import { getServiceClient } from '../../lib/supabase/service'
const {salonDefaults}=defaultsModule
export const metadata={title:'Book an Appointment'}
export const dynamic='force-dynamic'
export default async function BookingPage(){let services=[];try{const {data}=await getServiceClient().from('services').select('id,name,price,duration_minutes').eq('published',true).eq('enabled',true).order('sort_order');services=data||[]}catch{}if(!services.length)services=salonDefaults.services.map((item,index)=>({id:index+1,name:item.name,price:item.pricePence,duration_minutes:item.durationMinutes}));return <><PageIntro eyebrow="Booking" title="Book your appointment"><p>Choose a service and an available time. We will confirm your appointment personally.</p></PageIntro><section className="salon-wrap salon-section"><BookingForm services={services}/></section></>}
