import './globals.css'
import Navbar from './components/Navbar'
import { CartProvider } from './components/CartContext'
import Link from 'next/link'

export const metadata = {
  title: 'VIVA HAIR - 太子髮型屋',
  description: 'VIVA HAIR 九龍太子通菜街17A 專業髮型設計',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-HK">
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
        </CartProvider>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <p>© 2026 VIVA HAIR. All Rights Reserved.</p>
            <p>九龍太子通菜街17A 1樓</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
