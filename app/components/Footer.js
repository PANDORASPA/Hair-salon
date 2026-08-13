import Link from 'next/link'

export default function Footer({ salon }) {
  const { identity, contact } = salon
  return (
    <footer className="salon-footer">
      <div><strong>{identity.name}</strong><p>Asian hair expertise in a calm Bristol city-centre studio. By appointment only.</p></div>
      <div><strong>Visit</strong><p>{contact.area}<br />{contact.addressNote}</p></div>
      <div><strong>Explore</strong><p><Link href="/services">Services</Link><br /><Link href="/booking">Book Online</Link><br /><Link href="/gallery">Gallery</Link><br /><Link href="/account">My Account</Link></p></div>
      <div><strong>Contact</strong><p><a href={`https://wa.me/${contact.whatsapp}`}>WhatsApp</a><br /><a href={`mailto:${contact.email}`}>Email</a><br /><a href={`https://instagram.com/${contact.instagram}`}>Instagram</a></p></div>
      <small>© 2026 {identity.name}. All rights reserved.</small>
    </footer>
  )
}
