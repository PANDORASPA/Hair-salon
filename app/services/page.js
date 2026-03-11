'use client'

import Link from 'next/link'

const services = [
  { id: 1, name: '剪髮', price: 280, time: '60分', desc: '專業剪髮造型，根據臉型設計最適合您的髮型', img: '✂️' },
  { id: 2, name: '染髮', price: 680, time: '120分', desc: '使用優質染髮劑，顏色持久自然', img: '🎨' },
  { id: 3, name: '燙髮', price: 880, time: '150分', desc: '專業燙髮服務，打造自然卷曲效果', img: '💇' },
  { id: 4, name: '護髮', price: 380, time: '60分', desc: '深層護理，修復受損髮質', img: '💆' },
  { id: 5, name: '头皮护理', price: 450, time: '45分', desc: '專業头皮按摩及護理，改善头皮問題', img: '🧴' },
  { id: 6, name: '造型', price: 180, time: '30分', desc: '重要場合造型設計', img: '💅' },
]

export default function Services() {
  return (
    <>
      <section style={{ padding: '40px 0', background: '#FAF8F5', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', color: '#3D3D3D' }}>服務<span style={{ color: '#A68B6A' }}>項目</span></h1>
        <p style={{ color: '#666', marginTop: '10px' }}>專業團隊為您提供優質服務</p>
      </section>

      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
            {services.map(service => (
              <div key={service.id} style={{ background: '#fff', border: '1px solid #E8E0D5', borderRadius: '16px', padding: '25px' }}>
                <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', background: '#FAF8F5', borderRadius: '12px', marginBottom: '20px' }}>{service.img}</div>
                <h3 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '10px' }}>{service.name}</h3>
                <p style={{ color: '#666', marginBottom: '15px', lineHeight: 1.6 }}>{service.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '28px', fontWeight: 700, color: '#A68B6A' }}>${service.price}</span>
                    <span style={{ color: '#999', marginLeft: '10px' }}>{service.time}</span>
                  </div>
                  <Link href="/booking" style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #A68B6A, #8B7355)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>預約</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
