'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Loading Skeleton Component
function Skeleton({ className, style }) {
  return (
    <div 
      className="skeleton" 
      style={{
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '8px',
        ...style
      }}
    />
  )
}

export default function Services() {
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const services = [
    { id: 'cut', name: '剪髮', price: 280, duration: 60 },
    { id: 'color', name: '染髮', price: 680, duration: 120 },
    { id: 'perm', name: '燙髮', price: 880, duration: 150 },
    { id: 'treatment', name: '護髮', price: 380, duration: 60 },
    { id: 'styling', name: '造型', price: 180, duration: 30 },
    { id: 'bridal', name: '新娘造型', price: 1280, duration: 180 },
  ]

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#FAF8F5' }}>
      <section style={{ padding: '50px 16px', background: '#fff', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '10px', color: '#3D3D3D', fontWeight: 300, letterSpacing: '0.15em' }}>
          SERVICES
        </h1>
        <p style={{ color: '#8A8A8A' }}>專業髮型服務</p>
      </section>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px' }}>
        {loading ? (
          // Loading Skeletons
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden' }}>
                <Skeleton style={{ height: '180px' }} />
                <div style={{ padding: '24px' }}>
                  <Skeleton className="skeleton-title" />
                  <Skeleton className="skeleton-text" style={{ width: '80%' }} />
                  <Skeleton style={{ height: '40px', width: '120px', marginTop: '16px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Actual Content with Stagger Animation
          <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {services.map((service, i) => (
              <div key={i} className="card hover-lift" style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '180px', 
                  background: 'linear-gradient(135deg, #E8E0D5, #D4C4B0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '56px'
                }}>
                  {service.id === 'cut' && '✂️'}
                  {service.id === 'color' && '🎨'}
                  {service.id === 'perm' && '💇'}
                  {service.id === 'treatment' && '🧴'}
                  {service.id === 'styling' && '✨'}
                  {service.id === 'bridal' && '👰'}
                </div>
                <div style={{ padding: '24px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#3D3D3D' }}>{service.name}</h3>
                  <p style={{ color: '#8A8A8A', fontSize: '14px', marginBottom: '16px' }}>{service.duration}分鐘</p>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '16px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '700', color: '#A68B6A' }}>${service.price}</span>
                  </div>
                  <Link href="/booking" className="btn btn-primary" style={{ padding: '12px 28px' }}>
                    預約
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
