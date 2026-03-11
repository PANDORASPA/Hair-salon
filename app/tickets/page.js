'use client'

import Link from 'next/link'

const tickets = [
  { 
    id: 1, 
    name: 'Basic套票', 
    price: 680, 
    orig: 860, 
    times: 2, 
    features: ['任何服務適用', '有效期6個月', '可與他人共用'],
    popular: false,
    img: '🎁'
  },
  { 
    id: 2, 
    name: 'Premium套票', 
    price: 1280, 
    orig: 1680, 
    times: 2, 
    features: ['任何服務適用', '有效期12個月', '可與他人共用', '免費升級護理'],
    popular: true,
    img: '💎'
  },
  { 
    id: 3, 
    name: '月度計劃', 
    price: 980, 
    orig: 1200, 
    times: 4, 
    features: ['任何服務適用', '有效期1個月', '每月自動重置'],
    popular: false,
    img: '📅'
  },
]

export default function Tickets() {
  return (
    <>
      <section style={{ padding: '40px 0', background: '#FAF8F5', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', color: '#3D3D3D' }}>套票<span style={{ color: '#A68B6A' }}>優惠</span></h1>
        <p style={{ color: '#666', marginTop: '10px' }}>購買套票更優惠，省錢又方便</p>
      </section>

      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
            {tickets.map(ticket => (
              <div key={ticket.id} style={{ background: '#fff', border: ticket.popular ? '2px solid #A68B6A' : '1px solid #E8E0D5', borderRadius: '16px', padding: '30px', position: 'relative' }}>
                {ticket.popular && (
                  <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#A68B6A', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                    最受欢迎
                  </span>
                )}
                <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', background: 'linear-gradient(135deg, #3D3D3D, #6B6B6B)', borderRadius: '12px', marginBottom: '20px', color: '#fff' }}>{ticket.img}</div>
                <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '5px' }}>{ticket.name}</h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>{ticket.times}次服務</p>
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 700, color: '#A68B6A' }}>${ticket.price}</span>
                  <span style={{ color: '#999', textDecoration: 'line-through', marginLeft: '15px' }}>${ticket.orig}</span>
                  <span style={{ color: '#34d399', marginLeft: '10px', fontWeight: 600 }}>慳${ticket.orig - ticket.price}</span>
                </div>
                <ul style={{ listStyle: 'none', marginBottom: '25px' }}>
                  {ticket.features.map((f, i) => (
                    <li key={i} style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #f0f0f0' }}>
                      ✓ {f}
                    </li>
                  ))}
                </ul>
                <Link href="/booking" style={{ display: 'block', textAlign: 'center', padding: '15px', background: ticket.popular ? 'linear-gradient(135deg, #A68B6A, #8B7355)' : '#fff', color: ticket.popular ? '#fff' : '#A68B6A', border: '2px solid #A68B6A', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
                  立即購買
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
