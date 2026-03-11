'use client'

import { useState } from 'react'

const faqs = [
  { q: '如何預約服務？', a: '您可以通過我們的網站直接預約，選擇服務項目、日期和時間，填寫資料後即可提交預約。' },
  { q: '預約需要付訂金嗎？', a: '一般預約不需要付訂金，但如果您需要取消或更改預約，請提前一天通知我們。' },
  { q: '營業時間是？', a: '我們的營業時間為早上9點至晚上7點，每逢星期一休息。' },
  { q: '可以網上付款嗎？', a: '是的，我們支援信用卡、PayMe和轉數快等付款方式。' },
  { q: '取消預約的政策？', a: '請於預約日期前1天取消或更改，否則可能會收取一定費用。' },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      <section style={{ padding: '40px 0', background: '#FAF8F5', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', color: '#3D3D3D' }}>常見<span style={{ color: '#A68B6A' }}>問題</span></h1>
      </section>

      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ background: '#fff', borderRadius: '12px', marginBottom: '15px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div 
                onClick={() => toggle(index)}
                style={{ 
                  width: '100%', 
                  padding: '20px', 
                  background: 'transparent', 
                  border: 'none', 
                  textAlign: 'left', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  userSelect: 'none'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '16px' }}>{faq.q}</span>
                <span style={{ fontSize: '24px', color: '#A68B6A', fontWeight: 'bold' }}>{openIndex === index ? '−' : '+'}</span>
              </div>
              {openIndex === index && (
                <div style={{ padding: '0 20px 20px', color: '#666', lineHeight: 1.8, borderTop: '1px solid #f0f0f0', marginTop: '-1px' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
