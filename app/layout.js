import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lo-chan-hair-bristol.vercel.app'
const description = 'Salon Poke Bristol is an Asian hair salon specialising in cutting, colour, perm, straightening and hair repair.'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Salon Poke Bristol | Asian Hair Salon', template: '%s | Salon Poke Bristol' },
  description,
  keywords: ['Asian hair salon Bristol', 'Hong Kong hairstylist Bristol', 'Salon Poke Bristol'],
  openGraph: { type: 'website', locale: 'en_GB', url: siteUrl, siteName: 'Salon Poke Bristol', title: 'Salon Poke Bristol', description },
}

export const viewport = { width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body className="salon-site">
        <Toaster />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
