'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: '首頁' },
    { href: '/team', label: '髮型師' },
    { href: '/services', label: '服務' },
    { href: '/tickets', label: '套票' },
    { href: '/coupons', label: '優惠' },
    { href: '/products', label: '產品' },
    { href: '/booking', label: '預約' },
    { href: '/articles', label: '文章' },
    { href: '/faq', label: 'FAQ' },
  ]

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="logo" onClick={closeMenu}>
            VIVA HAIR
          </Link>
          
          {/* Desktop Navigation */}
          <div className="nav-links">
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className={pathname === link.href ? 'active' : ''}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" className="nav-login">登入</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="選單"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={closeMenu}
      />

      {/* Mobile Menu Panel */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <span style={{ fontWeight: 700, color: '#A68B6A', fontSize: '18px' }}>VIVA HAIR</span>
          <button className="mobile-menu-close" onClick={closeMenu}>✕</button>
        </div>
        
        <div className="mobile-menu-links">
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              className={pathname === link.href ? 'active' : ''}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          
          <div style={{ height: '1px', background: '#eee', margin: '12px 0' }} />
          
          <Link href="/login" onClick={closeMenu}>
            👤 登入 / 註冊
          </Link>
          
          <Link href="/admin" onClick={closeMenu}>
            ⚙️ 管理後台
          </Link>
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid #eee', marginTop: 'auto' }}>
          <p style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
            九龍太子通菜街17A 1樓
          </p>
          <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', marginTop: '4px' }}>
            © 2026 VIVA HAIR
          </p>
        </div>
      </div>
    </>
  )
}
