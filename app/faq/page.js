'use client'

import { useState } from 'react'

const FAQS = [
  { q: '預約可以改期嗎？', a: '可以，請提前24小時通知我們改期。' },
  { q: '取消預約會扣訂金嗎？', a: '24小時內取消會扣除訂金作為取消費用。' },
  { q: '我可以帶自己既髮型圖片嗎？', a: '當然可以！我們鼓勵客人帶圖片溝通你想要既髮型。' },
  { q: '燙髮可以維持幾耐？', a: '一般可以維持3-6個月，視乎個人髮質同護理。' },
  { q: '有冇學生優惠？', a: '有！出示學生證可享9折優惠。' },
  { q: '可以只剪劉海嗎？', a: '可以既，最少收費$100。' },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#FAF8F5' }}>
      <section style={{ padding: '40px 20px', background: '#A68B6A', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', color: '#fff', fontWeight: 400, letterSpacing: '0.15em' }}>FAQ</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '10px' }}>常見問題</p>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        {FAQS.map((faq, i) => (
          <div 
            key={i}
            style={{ 
              background: '#fff', 
              borderRadius: '12px', 
              marginBottom: '12px', 
              border: '1px solid #E8E0D5',
              overflow: 'hidden'
            }}
          >
            <div 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{ 
                padding: '20px', 
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontWeight: '500', color: '#3D3D3D' }}>{faq.q}</span>
              <span style={{ fontSize: '20px', color: '#A68B6A' }}>{openIndex === i ? '−' : '+'}</span>
            </div>
            {openIndex === i && (
              <div style={{ padding: '0 20px 20px', color: '#6B6B6B', fontSize: '14px' }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
