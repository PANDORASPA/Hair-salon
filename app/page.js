'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    { title: 'VIVA HAIR', desc: '為您打造自然舒適的完美造型', bg: '#FAF8F5' },
    { title: '新客優惠', desc: '首次預約8折', bg: '#F5F0E8', badge: '限時' },
    { title: '會員積分', desc: '消費$1 = 1積分', bg: '#E8E0D5', link: '/login', linkText: '加入會員' },
  ]

  const services = [
    { id: 1, name: '剪髮', price: 280, time: '60分', img: '✂️' },
    { id: 2, name: '染髮', price: 680, time: '120分', img: '🎨' },
    { id: 3, name: '燙髮', price: 880, time: '150分', img: '💇' },
  ]

  const tickets = [
    { id: 1, name: 'Basic套票', price: 680, orig: 860, times: 2, img: '🎁' },
    { id: 2, name: 'Premium套票', price: 1280, orig: 1680, times: 2, img: '💎' },
  ]

  return (
    <>
      {/* Hero Banner */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: slides[currentSlide].bg }}>
        <div style={{ textAlign: 'center', zIndex: 1, padding: '20px' }}>
          {slides[currentSlide].badge && (
            <span style={{ background: '#A68B6A', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'inline-block', marginBottom: '15px' }}>
              {slides[currentSlide].badge}
            </span>
          )}
          <h1 style={{ fontSize: '48px', marginBottom: '15px', color: '#3D3D3D' }}>{slides[currentSlide].title}</h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>{slides[currentSlide].desc}</p>
          {slides[currentSlide].link ? (
            <Link href={slides[currentSlide].link} className="btn" style={{ display: 'inline-block', padding: '12px 28px', background: 'linear-gradient(135deg, #A68B6A, #8B7355)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
              {slides[currentSlide].linkText}
            </Link>
          ) : (
            <Link href="/booking" className="btn" style={{ display: 'inline-block', padding: '12px 28px', background: 'linear-gradient(135deg, #A68B6A, #8B7355)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
              立即預約
            </Link>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} style={{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', background: currentSlide === i ? '#A68B6A' : '#ccc', cursor: 'pointer' }} />
          ))}
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '30px', color: '#3D3D3D' }}>熱門服務</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            {services.map((service) => (
              <div key={service.id} style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: '16px', padding: '20px' }}>
                <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', background: '#FAF8F5', borderRadius: '8px', marginBottom: '15px', color: '#A68B6A' }}>{service.img}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>{service.name}</h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>{service.time}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '24px', fontWeight: 700, color: '#A68B6A' }}>${service.price}</span>
                  <Link href="/booking" style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #A68B6A, #8B7355)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>預約</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tickets */}
      <section style={{ padding: '60px 20px', background: '#FAF8F5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '30px', color: '#3D3D3D' }}>套票優惠</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            {tickets.map((ticket) => (
              <div key={ticket.id} style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: '16px', padding: '20px', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#A68B6A', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>慳${ticket.orig - ticket.price}</span>
                <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', background: 'linear-gradient(135deg, #3D3D3D, #6B6B6B)', borderRadius: '8px', marginBottom: '15px', color: '#fff' }}>{ticket.img}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>{ticket.name}</h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>{ticket.times}次</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '24px', fontWeight: 700, color: '#A68B6A' }}>${ticket.price}</span>
                  <Link href="/tickets" style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #A68B6A, #8B7355)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>購買</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '15px', color: '#3D3D3D' }}>預約免費咨詢</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>專業團隊為您打造完美造型</p>
          <Link href="/booking" style={{ display: 'inline-block', padding: '15px 40px', background: 'linear-gradient(135deg, #A68B6A, #8B7355)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '16px' }}>立即預約</Link>
        </div>
      </section>
    </>
  )
}
