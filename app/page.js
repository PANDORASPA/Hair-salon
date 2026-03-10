'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  const slides = [
    { title: 'VIVA HAIR', desc: '為您打造自然舒適的完美造型', badge: '', bg: 'linear-gradient(135deg, rgba(250,248,245,0.92), rgba(245,240,232,0.88)), url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80)' },
    { title: '新客8折', desc: '首次預約即享8折優惠', badge: '限時', bg: 'linear-gradient(135deg, rgba(166,139,106,0.92), rgba(139,115,85,0.88)), url(https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&q=80)' },
    { title: '會員積分', desc: '消費$1 = 1積分', badge: '', bg: 'linear-gradient(135deg, rgba(61,61,61,0.92), rgba(107,107,107,0.88)), url(https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&q=80)' },
  ]

  const services = [
    { id: 'cut', name: '剪髮', price: 280, duration: '60', img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&q=80' },
    { id: 'color', name: '染髮', price: 680, duration: '120', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80' },
    { id: 'perm', name: '燙髮', price: 880, duration: '150', img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&q=80' },
    { id: 'treatment', name: '護髮', price: 380, duration: '60', img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&q=80' },
  ]

  const staff = [
    { name: 'Mark', title: '創意總監', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
    { name: 'Sophia', title: '高級髮型師', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
    { name: 'Jack', title: '資深髮型師', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80' },
    { name: 'Lily', title: '髮型師', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80' },
  ]

  return (
    <>
      {/* Hero Section - With Animation */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '90vh', background: slides[currentSlide].bg, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.88)', 
          minHeight: '90vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textAlign: 'center', 
          padding: '20px',
          animation: 'fadeInUp 0.8s ease'
        }}>
          <div style={{ maxWidth: '600px', animation: loaded ? 'fadeInUp 0.8s ease 0.2s forwards' : 'none', opacity: loaded ? 1 : 0 }}>
            {slides[currentSlide].badge && (
              <span style={{ 
                background: 'linear-gradient(135deg, #A68B6A, #8B7355)', 
                color: '#fff', 
                padding: '10px 24px', 
                borderRadius: '25px', 
                fontSize: '14px', 
                fontWeight: '600', 
                display: 'inline-block', 
                marginBottom: '24px',
                boxShadow: '0 4px 15px rgba(166,139,106,0.4)'
              }}>
                {slides[currentSlide].badge}
              </span>
            )}
            <h1 style={{ 
              fontSize: 'clamp(36px, 7vw, 64px)', 
              marginBottom: '24px', 
              color: '#3D3D3D', 
              fontWeight: 200, 
              letterSpacing: '0.1em' 
            }}>
              {slides[currentSlide].title}
            </h1>
            <p style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: '#6B6B6B', marginBottom: '16px' }}>
              {slides[currentSlide].desc}
            </p>
            <p style={{ fontSize: '14px', color: '#8A8A8A', marginBottom: '40px' }}>
              📍 九龍太子通菜街17A 1樓
            </p>
            <Link href="/booking" 
              className="btn btn-primary"
              style={{ 
                display: 'inline-block',
                padding: '16px 42px', 
                background: 'linear-gradient(135deg, #A68B6A, #8B7355)', 
                color: '#fff', 
                borderRadius: '30px', 
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '16px',
                boxShadow: '0 8px 25px rgba(166,139,106,0.4)'
              }}
            >
              立即預約
            </Link>
          </div>
        </div>
        
        {/* Carousel Dots - With Bounce */}
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px' }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{ 
                width: currentSlide === i ? '32px' : '12px', 
                height: '12px', 
                borderRadius: '6px', 
                border: 'none', 
                background: currentSlide === i ? '#A68B6A' : 'rgba(255,255,255,0.5)', 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }} 
            />
          ))}
        </div>
      </section>

      {/* Quick Info - Glassmorphism */}
      <section style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '40px 20px', borderBottom: '1px solid #E8E0D5' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', textAlign: 'center' }}>
          {[
            { icon: '📞', title: '電話', value: '+852 1234 5678' },
            { icon: '🕐', title: '營業時間', value: '10:00 - 20:00' },
            { icon: '💬', title: 'WhatsApp', value: '+852 1234 5678', color: '#25D366' }
          ].map((item, i) => (
            <div key={i} style={{ animation: `fadeInUp 0.5s ease ${0.1 * i + 0.3}s forwards`, opacity: 0 }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>{item.icon}</div>
              <div style={{ fontSize: '12px', color: '#8A8A8A', marginBottom: '4px' }}>{item.title}</div>
              <div style={{ fontSize: '15px', fontWeight: '500', color: item.color || 'inherit' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services - Stagger Animation */}
      <section style={{ padding: '100px 20px', background: '#FAF8F5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '12px', color: '#3D3D3D', fontWeight: 300, letterSpacing: '0.15em', animation: 'fadeInUp 0.5s ease forwards', opacity: 0 }}>
            SERVICES
          </h2>
          <p style={{ textAlign: 'center', color: '#8A8A8A', marginBottom: '50px', animation: 'fadeInUp 0.5s ease 0.1s forwards', opacity: 0 }}>專業髮型服務</p>
          
          <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}>
            {services.map((service, i) => (
              <div key={i} className="card hover-lift" style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={service.img} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: '24px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#3D3D3D' }}>{service.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'baseline', marginBottom: '16px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '700', color: '#A68B6A' }}>${service.price}</span>
                    <span style={{ fontSize: '14px', color: '#8A8A8A' }}>{service.duration}分鐘</span>
                  </div>
                  <Link href="/booking" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '14px' }}>
                    預約
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Link href="/services" style={{ color: '#A68B6A', textDecoration: 'none', fontSize: '15px', borderBottom: '2px solid #A68B6A', paddingBottom: '4px', transition: 'all 0.3s' }}>
              查看全部服務 →
            </Link>
          </div>
        </div>
      </section>

      {/* Team - With Hover Effects */}
      <section style={{ padding: '100px 20px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '12px', color: '#3D3D3D', fontWeight: 300, letterSpacing: '0.15em' }}>STYLIST</h2>
          <p style={{ textAlign: 'center', color: '#8A8A8A', marginBottom: '50px' }}>專業髮型師團隊</p>
          
          <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>
            {staff.map((member, i) => (
              <div key={i} className="hover-lift" style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ 
                  width: '180px', 
                  height: '180px', 
                  borderRadius: '50%', 
                  overflow: 'hidden',
                  margin: '0 auto 20px',
                  border: '4px solid #A68B6A',
                  boxShadow: '0 10px 30px rgba(166,139,106,0.3)',
                  transition: 'all 0.3s ease'
                }}>
                  <img src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontSize: '20px', marginBottom: '4px', color: '#3D3D3D' }}>{member.name}</h3>
                <p style={{ color: '#A68B6A', fontSize: '14px' }}>{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Glassmorphism */}
      <section style={{ 
        padding: '100px 20px', 
        background: 'linear-gradient(135deg, rgba(166,139,106,0.95), rgba(139,115,85,0.95))', 
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.5
        }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '36px', marginBottom: '16px', color: '#fff', fontWeight: 300 }}>預約免費咨詢</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px', fontSize: '18px' }}>專業團隊為您打造完美造型</p>
          <Link href="/booking" 
            className="btn"
            style={{ 
              display: 'inline-block',
              padding: '18px 48px', 
              background: '#fff', 
              color: '#A68B6A', 
              borderRadius: '30px', 
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
            }}
          >
            立即預約
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#3D3D3D', color: '#fff', padding: '60px 20px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 300, letterSpacing: '0.15em', marginBottom: '24px' }}>
          VIVA <span style={{ color: '#A68B6A' }}>HAIR</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '30px', flexWrap: 'wrap' }}>
          {['首頁', '服務', '套票', '產品', '預約'].map((item, i) => (
            <Link key={i} href={item === '首頁' ? '/' : `/${item === '套票' ? 'tickets' : item === '產品' ? 'products' : item === '預約' ? 'booking' : item}`} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>
              {item}
            </Link>
          ))}
        </div>
        <p style={{ opacity: 0.5, fontSize: '13px' }}>© 2026 VIVA HAIR. All rights reserved.</p>
      </footer>

      {/* Floating WhatsApp - With Bounce Animation */}
      <div style={{ 
        position: 'fixed', 
        bottom: '30px', 
        right: '30px', 
        width: '60px', 
        height: '60px', 
        background: '#25D366', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        boxShadow: '0 8px 25px rgba(37,211,102,0.5)', 
        zIndex: 999,
        animation: 'bounce 2s infinite'
      }}>
        <a href="https://wa.me/85212345678" style={{ fontSize: '30px', textDecoration: 'none' }}>💬</a>
      </div>
    </>
  )
}
