import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="salon-footer">
      <div><strong>Salon Poke Bristol</strong><p>Asian hair expertise in a calm Bristol city-centre studio. By appointment only.</p></div>
      <div><strong>Visit</strong><p>Bristol City Centre<br />Park Row Area<br />Full address shared after confirmation</p></div>
      <div><strong>Explore</strong><p><Link href="/services">Services</Link><br /><Link href="/booking">Book Online</Link><br /><Link href="/gallery">Gallery</Link><br /><Link href="/account">My Account</Link></p></div>
      <div><strong>Contact</strong><p><a href="https://wa.me/447724594963">WhatsApp</a><br /><a href="mailto:hello@salonpokebristol.com">Email</a><br /><a href="https://instagram.com/salonpokebristol">Instagram</a></p></div>
      <small>© 2026 Salon Poke Bristol. All rights reserved.</small>
    </footer>
  )
}
