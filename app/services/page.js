import Link from 'next/link'
import PageIntro from '../components/PageIntro'
import { getPublicSalonContent } from '../../lib/content/public-content'

export const metadata = { title: 'Services & Prices' }
export default async function ServicesPage() {
  const salon = await getPublicSalonContent()
  const categories = [...new Set(salon.services.map((item) => item.category))]
  return <><PageIntro eyebrow="Services & Price" title="Services tailored to your hair"><p>A clear price list for haircut, colour, perm, straightening and treatment services in Bristol.</p></PageIntro><div className="salon-wrap salon-section">{categories.map((category) => <section className="salon-service-group" key={category}><h2>{category}</h2>{salon.services.filter((item) => item.category === category).map((item) => <article key={item.id || item.name}><div><h3>{item.name}</h3>{item.description ? <p>{item.description}</p> : null}<small>{item.durationMinutes} min</small></div><strong>{item.pricePence ? `£${item.pricePence / 100}` : 'Free'}</strong></article>)}</section>)}<div className="salon-notice"><h2>A note on pricing</h2><p>Prices may vary depending on hair length, thickness and condition. Final price will be confirmed after consultation.</p><Link className="salon-button" href="/booking">Book Consultation</Link></div></div></>
}
