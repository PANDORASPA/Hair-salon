import Link from 'next/link'
import { getPublicSalonContent } from '../lib/content/public-content'

export default async function HomePage() {
  const salon = await getPublicSalonContent()
  const featured = salon.services.filter((item) => ['Haircut', 'Colour', 'Straightening', 'Treatment'].includes(item.category)).slice(0, 5)
  return <>
    <section className="salon-hero salon-wrap">
      <div><p className="salon-kicker">{salon.identity.eyebrow}</p><h1>{salon.identity.heroTitle}</h1><p className="salon-lead">{salon.identity.heroBody}</p><div className="salon-actions"><Link className="salon-button" href="/booking">Book Your Appointment</Link><Link className="salon-button secondary" href="/services">View Services</Link></div></div>
      <figure className="salon-hero-image"><img src="/gallery/studio-interior-clean.jpg" alt="Salon Poke Bristol private studio interior" /></figure>
    </section>
    <section className="salon-stats"><div>20+ Years<span>Professional Experience</span></div><div>Asian Hair<span>Specialist</span></div><div>Bristol City<span>Centre Based</span></div><div>By Appointment<span>Only</span></div></section>
    <section className="salon-section salon-wrap"><p className="salon-kicker">What we do</p><h2>Popular Services</h2><p className="salon-lead">Every appointment begins with a short consultation so we can recommend the right treatment for your hair.</p><div className="salon-card-grid">{featured.map((item) => <article className="salon-card" key={item.name}><h3>{item.name}</h3><p>{item.description || 'Personalised care designed around your hair type, condition and lifestyle.'}</p><strong>{item.pricePence ? `£${item.pricePence / 100}` : 'Free'}</strong><Link href="/services">Details</Link></article>)}</div></section>
    <section className="salon-section salon-tint"><div className="salon-wrap salon-split"><div><p className="salon-kicker">About Salon Poke</p><h2>Asian hair expertise, in the heart of Bristol.</h2><p>Over 20 years of professional experience across cutting, colouring, perming, straightening and hair repair, built around a deep understanding of Asian hair texture and density.</p><Link href="/about">Read our story</Link></div><img src="/gallery/precision-cutting.png" alt="Precision cutting in progress" /></div></section>
    <section className="salon-section salon-wrap"><p className="salon-kicker">Gallery</p><h2>Recent work</h2><div className="salon-gallery">{salon.gallery.map((image) => <Link href="/gallery" key={image.id || image.path}><img src={image.path} alt={image.alt} /><span>{image.label}</span></Link>)}</div></section>
    <section className="salon-cta"><p className="salon-kicker">Ready when you are</p><h2>Book your appointment today.</h2><p>{salon.bookingNotice || 'Choose your service, pick a time and we will confirm your appointment personally.'}</p><div className="salon-actions"><Link className="salon-button" href="/booking">Book Online</Link><a className="salon-button secondary" href={`https://wa.me/${salon.contact.whatsapp}`}>WhatsApp Us</a></div></section>
  </>
}


