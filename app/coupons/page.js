'use client'

import { useState, useEffect } from 'react'

const COUPONS = [
  { code: 'BDAY2026', discount: 50, type: 'fixed', desc: '生日優惠', minSpend: 0, expires: '2026-12-31', active: true },
  { code: 'NEW20', discount: 20, type: 'percent', desc: '新客8折', minSpend: 200, expires: '2026-12-31', active: true },
  { code: 'SUMMER30', discount: 30, type: 'percent', desc: '夏日優惠', minSpend: 500, expires: '2026-08-31', active: true },
]

export default function Coupons() {
  const [inputCode, setInputCode] = useState('')
  const [appliedCode, setAppliedCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [myCoupons, setMyCoupons] = useState([])

  useEffect(() => {
    // Load user's saved coupons from localStorage
    const saved = localStorage.getItem('VIVA_myCoupons')
    if (saved) {
      setMyCoupons(JSON.parse(saved))
    }
  }, [])

  const handleApply = () => {
    setError('')
    setSuccess('')
    
    const coupon = COUPONS.find(c => c.code.toUpperCase() === inputCode.toUpperCase() && c.active)
    
    if (!coupon) {
      setError('優惠碼無效')
      return
    }
    
    // Check expiry
    if (new Date(coupon.expires) < new Date()) {
      setError('優惠碼已過期')
      return
    }
    
    // Save to localStorage (simulating user having this coupon)
    const newCoupons = [...myCoupons, coupon]
    setMyCoupons(newCoupons)
    localStorage.setItem('VIVA_myCoupons', JSON.stringify(newCoupons))
    
    setAppliedCode(coupon.code)
    setSuccess(`優惠碼 ${coupon.code} 已兌換！${coupon.desc}`)
    setInputCode('')
  }

  const handleUse = (coupon) => {
    // Redirect to cart with coupon pre-applied
    window.location.href = '/cart?code=' + coupon.code
  }

  const activeCoupons = COUPONS.filter(c => c.active)

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#FAF8F5' }}>
      <section style={{ padding: '40px 20px', background: '#A68B6A', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', color: '#fff', fontWeight: 400, letterSpacing: '0.15em' }}>COUPONS</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '10px' }}>優惠碼</p>
      </section>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Redeem Section */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '30px', border: '1px solid #E8E0D5' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>兌換優惠碼</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="輸入優惠碼"
              style={{ flex: 1, padding: '14px', border: '1px solid #E8E0D5', borderRadius: '8px', fontSize: '16px', textTransform: 'uppercase' }}
            />
            <button 
              onClick={handleApply}
              style={{ padding: '14px 24px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >
              兌換
            </button>
          </div>
          
          {error && (
            <div style={{ marginTop: '12px', padding: '12px', background: '#ffebee', borderRadius: '8px', color: '#F44336', fontSize: '14px' }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{ marginTop: '12px', padding: '12px', background: '#E8F5E9', borderRadius: '8px', color: '#4CAF50', fontSize: '14px' }}>
              {success}
            </div>
          )}
          
          <p style={{ marginTop: '12px', fontSize: '13px', color: '#8A8A8A' }}>
            試試: BDAY2026, NEW20, SUMMER30
          </p>
        </div>

        {/* Available Coupons */}
        <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>可用優惠</h2>
        <div style={{ display: 'grid', gap: '16px', marginBottom: '30px' }}>
          {activeCoupons.map((coupon, i) => {
            const isExpired = new Date(coupon.expires) < new Date()
            return (
              <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #E8E0D5', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ background: '#A68B6A', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '16px', fontWeight: '700' }}>
                        {coupon.code}
                      </span>
                      <span style={{ fontSize: '14px', color: '#8A8A8A' }}>
                        {coupon.type === 'percent' ? `${coupon.discount}% OFF` : `$${coupon.discount} OFF`}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#3D3D3D', marginBottom: '4px' }}>{coupon.desc}</div>
                    {coupon.minSpend > 0 && (
                      <div style={{ fontSize: '12px', color: '#8A8A8A' }}>最低消費: ${coupon.minSpend}</div>
                    )}
                    <div style={{ fontSize: '12px', color: isExpired ? '#F44336' : '#8A8A8A' }}>
                      到期: {coupon.expires} {isExpired && '(已過期)'}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setInputCode(coupon.code)
                      setError('')
                      setSuccess('')
                    }}
                    style={{ padding: '8px 16px', background: '#FAF8F5', border: '1px solid #E8E0D5', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    使用
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* My Coupons */}
        {myCoupons.length > 0 && (
          <>
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>我的優惠券</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {myCoupons.map((coupon, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #E8E0D5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ background: '#4CAF50', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
                      {coupon.code}
                    </span>
                    <span style={{ marginLeft: '12px', fontSize: '14px' }}>{coupon.desc}</span>
                  </div>
                  <button 
                    onClick={() => handleUse(coupon)}
                    style={{ padding: '8px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    去使用
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
