import Link from 'next/link'
import './globals.css'

export const metadata = {
  title: 'VIVA HAIR - 髮型屋預約系統',
  description: '九龍太子通菜街17A 髮型屋預約系統',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-HK">
      <body>
        <nav className="navbar">
          <div className="nav-container">
            <Link href="/" className="logo">VIVA HAIR</Link>
            <div className="nav-links">
              <Link href="/">首頁</Link>
              <Link href="/services">服務</Link>
              <Link href="/tickets">套票</Link>
              <Link href="/coupons">優惠</Link>
              <Link href="/products">產品</Link>
              <Link href="/booking">預約</Link>
              <Link href="/articles">文章</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/login">登入</Link>
              <Link href="/admin" className="nav-admin">後台</Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="footer">
          <p>© 2026 VIVA HAIR. All Rights Reserved.</p>
          <p>九龍太子通菜街17A 1樓</p>
        </footer>
      </body>
    </html>
  )
}
