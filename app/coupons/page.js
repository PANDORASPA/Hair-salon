'use client'

import { useState } from 'react'

const coupons = [
  { id: 1, name: '新客8折', code: 'NEW20', discount: 20, type: 'percent', minSpend: 0, desc: '首次預約8折優惠', validUntil: '2026-12-31' },
  { id: 2, name: '節省$100', code: 'SAVE100', discount: 100, type: 'fixed', minSpend: 500, desc: '消費滿$500減$100', validUntil: '2026-12-31' },
  { id: 3, name: '會員9折', code: 'MEMBER10', discount: 10, type: 'percent', minSpend: 0, desc: '會員專享9折', validUntil: '2026-12-31' },
]

export default function Coupons() {
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [message, setMessage] = useState('')

  const handleApply = () => {
    const coupon = coupons.find(c => c.code === appliedCoupon.toUpperCase())
    if (coupon) {
      setMessage(`✅ 已套用優惠：${coupon.name}`)
    } else {
      setMessage('❌ 優惠碼無效')
    }
  }

  return (
    <>
      <section style={{ padding: '40px 0', background: '#FAF8F5', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', color: '#3D3D3D' }}>優惠<span style={{ color: '#A68B6A' }}>Coupon</span></h1>
      </section>

      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Apply */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '25px', marginBottom: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '15px' }}>輸入優惠碼</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" value={appliedCoupon} onChange={(e) => setAppliedCoupon(e.target.value)} placeholder="輸入優惠碼" style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
              <button onClick={handleApply} style={{ padding: '12px 24px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>套用</button>
            </div>
            {message && <p style={{ marginTop: '10px', color: message.includes('✅') ? '#34d399' : '#ef4444' }}>{message}</p>}
          </div>

          {/* Coupon List */}
          <div style={{ display: 'grid', gap: '20px' }}>
            {coupons.map(coupon => (
              <div key={coupon.id} style={{ background: '#fff', borderRadius: '12px', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '2px dashed #A68B6A' }}>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#A68B6A' }}>{coupon.type === 'percent' ? `${coupon.discount}%` : `$${coupon.discount}`}</h3>
                  <p style={{ fontWeight: 600, marginTop: '5px' }}>{coupon.name}</p>
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>{coupon.desc}</p>
                  <p style={{ color: '#999', fontSize: '12px', marginTop: '5px' }}>有效期至：{coupon.validUntil}</p>
                </div>
                <button onClick={() => { setAppliedCoupon(coupon.code); setMessage('已複製優惠碼：' + coupon.code) }} style={{ padding: '10px 20px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  複製
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
