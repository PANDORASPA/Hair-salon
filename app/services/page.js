'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('enabled', true)
      .order('id')
    
    if (data) {
      setServices(data.map(s => ({
        ...s,
        time: s.time ? `${s.time}分` : '60分'
      })))
    }
    setLoading(false)
  }

  const defaultServices = [
    { id: 1, name: '剪髮', price: 280, time: '60分', desc: '專業剪髮造型，根據臉型設計最適合您的髮型', img: '✂️' },
    { id: 2, name: '染髮', price: 680, time: '120分', desc: '使用優質染髮劑，顏色持久自然', img: '🎨' },
    { id: 3, name: '燙髮', price: 880, time: '150分', desc: '專業燙髮服務，打造自然卷曲效果', img: '💇' },
    { id: 4, name: '護髮', price: 380, time: '60分', desc: '深層護理，修復受損髮質', img: '💆' },
    { id: 5, name: '头皮护理', price: 450, time: '45分', desc: '專業头皮按摩及護理，改善头皮問題', img: '🧴' },
    { id: 6, name: '造型', price: 180, time: '30分', desc: '重要場合造型設計', img: '💅' },
  ]

  const displayServices = services.length > 0 ? services : defaultServices

  return (
    <>
      <section style={{ padding: '30px 16px', background: '#FAF8F5', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', color: '#3D3D3D' }}>服務<span style={{ color: '#A68B6A' }}>項目</span></h1>
        <p style={{ color: '#666', marginTop: '8px', fontSize: '14px' }}>專業團隊為您提供優質服務 {loading ? '(載入中...)' : ''}</p>
      </section>

      <section style={{ padding: '24px 12px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {displayServices.map(service => (
              <div key={service.id} style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: '12px', padding: '16px' }}>
                <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', background: '#FAF8F5', borderRadius: '10px', marginBottom: '16px' }}>{service.img || '✂️'}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{service.name}</h3>
                <p style={{ color: '#666', marginBottom: '12px', lineHeight: 1.5, fontSize: '14px' }}>{service.desc || '專業服務'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '24px', fontWeight: 700, color: '#A68B6A' }}>${service.price}</span>
                    <span style={{ color: '#999', marginLeft: '8px', fontSize: '13px' }}>{service.time}</span>
                  </div>
                  <Link href="/booking" style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #A68B6A, #8B7355)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>預約</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
