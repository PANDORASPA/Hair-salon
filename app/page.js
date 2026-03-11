'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('enabled', true)
        .order('sort_order')
        .limit(3)
      
      if (data) {
        setServices(data.map(s => ({
          id: s.id,
          name: s.name,
          price: s.price,
          time: s.time ? `${s.time}分` : '60分',
          img: getServiceEmoji(s.name)
        })))
      }
      setLoading(false)
    }
    fetchServices()
  }, [])

  const getServiceEmoji = (name) => {
    if (name.includes('剪')) return '✂️'
    if (name.includes('染')) return '🎨'
    if (name.includes('燙')) return '💇'
    if (name.includes('護')) return '💆'
    if (name.includes('头皮')) return '🧴'
    return '✂️'
  }

  const slides = [
    { title: 'VIVA HAIR', desc: '為您打造自然舒適的完美造型', bg: '#FAF8F5' },
    { title: '新客優惠', desc: '首次預約8折', bg: '#F5F0E8', badge: '限時' },
    { title: '會員積分', desc: '消費$1 = 1積分', bg: '#E8E0D5', link: '/login', linkText: '加入會員' },
  ]

  const tickets = [
    { id: 1, name: 'Basic套票', price: 680, orig: 860, times: 2, img: '🎁' },
    { id: 2, name: 'Premium套票', price: 1280, orig: 1680, times: 2, img: '💎' },
  ]

  return (
    <>
      {/* Hero Banner */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: slides[currentSlide].bg, padding: '20px' }}>
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          {slides[currentSlide].badge && (
            <span style={{ background: '#A68B6A', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, display: 'inline-block', marginBottom: '12px' }}>
              {slides[currentSlide].badge}
            </span>
          )}
          <h1 style={{ fontSize: '32px', marginBottom: '10px', color: '#3D3D3D', lineHeight: 1.2 }}>{slides[currentSlide].title}</h1>
          <p style={{ fontSize: '15px', color: '#666', marginBottom: '16px' }}>{slides[currentSlide].desc}</p>
          {slides[currentSlide].link ? (
            <Link href={slides[currentSlide].link} style={{ display: 'inline-block', padding: '14px 28px', background: 'linear-gradient(135deg, #A68B6A, #8B7355)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}>
              {slides[currentSlide].linkText}
            </Link>
          ) : (
            <Link href="/booking" style={{ display: 'inline-block', padding: '14px 28px', background: 'linear-gradient(135deg, #A68B6A, #8B7355)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}>
              立即預約
            </Link>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} style={{ width: '8px', height: '8px', borderRadius: '50%', border: 'none', background: currentSlide === i ? '#A68B6A' : '#ccc', cursor: 'pointer' }} />
          ))}
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: '32px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px', color: '#3D3D3D' }}>熱門服務</h2>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#999' }}>載入中...</p>
          ) : services.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999' }}>暫時沒有服務</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
              {services.map((service) => (
                <div key={service.id} style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', background: '#FAF8F5', borderRadius: '8px', marginBottom: '12px' }}>{service.img}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>{service.name}</h3>
                  <p style={{ color: '#666', fontSize: '13px', marginBottom: '10px' }}>{service.time}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 700, color: '#A68B6A' }}>${service.price}</span>
                    <Link href="/booking" style={{ display: 'block', padding: '10px', background: 'linear-gradient(135deg, #A68B6A, #8B7355)', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}>預約</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tickets */}
      <section style={{ padding: '32px 16px', background: '#FAF8F5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px', color: '#3D3D3D' }}>套票優惠</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
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
      <section style={{ padding: '32px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#3D3D3D' }}>預約免費咨詢</h2>
          <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>專業團隊為您打造完美造型</p>
          <Link href="/booking" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg, #A68B6A, #8B7355)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}>立即預約</Link>
        </div>
      </section>
    </>
  )
}
