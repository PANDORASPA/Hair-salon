'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [memberName, setMemberName] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkLogin = () => {
      const member = localStorage.getItem('VIVA_member')
      if (member) {
        const memberData = JSON.parse(member)
        setIsLoggedIn(true)
        setMemberName(memberData.name || '會員')
      } else {
        setIsLoggedIn(false)
        setMemberName('')
      }
    }

    checkLogin()
    
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('VIVA_cart') || '[]')
      setCartCount(cart.reduce((sum, item) => sum + item.qty, 0))
    }
    updateCartCount()

    window.addEventListener('storage', checkLogin)
    window.addEventListener('storage', updateCartCount)
    
    return () => {
      window.removeEventListener('storage', checkLogin)
      window.removeEventListener('storage', updateCartCount)
    }
  }, [])

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
          VIVA <span style={{ color: '#A68B6A' }}>HAIR</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="nav">
          <Link href="/">首頁</Link>
          <Link href="/services">服務</Link>
          <Link href="/tickets">套票</Link>
          <Link href="/coupons">優惠</Link>
          <Link href="/products">產品</Link>
          <Link href="/booking">預約</Link>
          <Link href="/articles">文章</Link>
          
          <Link href="/cart" style={{ position: 'relative', color: '#A68B6A' }}>
            🛒
            {cartCount > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '-8px', 
                right: '-10px', 
                background: '#F44336', 
                color: '#fff', 
                borderRadius: '50%', 
                width: '18px', 
                height: '18px', 
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </Link>
          
          {isLoggedIn ? (
            <Link href="/member" style={{ color: '#A68B6A', fontWeight: '600' }}>
              👤 {memberName}
            </Link>
          ) : (
            <Link href="/login">登入</Link>
          )}
          
          <Link href="/admin" style={{ color: '#A68B6A' }}>後台</Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="mobile-menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span style={{ transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
          <span style={{ opacity: mobileMenuOpen ? 0 : 1 }}></span>
          <span style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <nav className={`nav ${mobileMenuOpen ? 'active' : ''}`} style={{ 
        display: mobileMenuOpen ? 'flex' : 'none',
        position: mobileMenuOpen ? 'absolute' : 'static',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 999
      }}>
        <Link href="/" onClick={() => setMobileMenuOpen(false)}>首頁</Link>
        <Link href="/services" onClick={() => setMobileMenuOpen(false)}>服務</Link>
        <Link href="/tickets" onClick={() => setMobileMenuOpen(false)}>套票</Link>
        <Link href="/coupons" onClick={() => setMobileMenuOpen(false)}>優惠</Link>
        <Link href="/products" onClick={() => setMobileMenuOpen(false)}>產品</Link>
        <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>預約</Link>
        <Link href="/articles" onClick={() => setMobileMenuOpen(false)}>文章</Link>
        <Link href="/faq" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
        
        <div style={{ borderTop: '1px solid #E8E0D5', margin: '8px 0' }}></div>
        
        {isLoggedIn ? (
          <>
            <Link href="/member" onClick={() => setMobileMenuOpen(false)}>👤 {memberName}</Link>
            <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>🛒 購物車 ({cartCount})</Link>
          </>
        ) : (
          <Link href="/login" onClick={() => setMobileMenuOpen(false)}>登入</Link>
        )}
        
        <Link href="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: '#A68B6A' }}>後台</Link>
      </nav>
    </header>
  )
}
