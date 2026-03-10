'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '../components/CartContext'
import { PAYMENT_METHODS } from '../config/payment'

export default function Cart() {
  const { cart, removeFromCart, updateQty, getTotal, clearCart } = useCart()
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [discountCode, setDiscountCode] = useState('')
  const [applying, setApplying] = useState(false)
  const [member, setMember] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('whatsapp')
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const router = useRouter()

  // Payment methods
  const paymentMethods = [
    { id: 'whatsapp', name: 'WhatsApp轉帳', icon: '💬', desc: '過數後確認' },
    { id: 'fps', name: 'FPS轉數快', icon: '🏦', desc: '銀行入數' },
    { id: 'payme', name: 'PayMe', icon: '💚', desc: 'PayMe過數' },
    { id: 'cash', name: '現金', icon: '💵', desc: '到店付款' },
  ]

  // Coupons
  const COUPONS = [
    { code: 'BDAY2026', discount: 50, type: 'fixed', minSpend: 0 },
    { code: 'NEW20', discount: 20, type: 'percent', minSpend: 200 },
    { code: 'SUMMER30', discount: 30, type: 'percent', minSpend: 500 },
  ]

  useEffect(() => {
    const memberData = localStorage.getItem('VIVA_member')
    if (memberData) setMember(JSON.parse(memberData))

    const savedCode = localStorage.getItem('VIVA_discountCode')
    const savedAmount = localStorage.getItem('VIVA_discountAmount')
    if (savedCode && savedAmount) {
      setDiscountCode(savedCode)
      setDiscount(parseFloat(savedAmount))
    }
  }, [])

  const handleApplyCoupon = () => {
    if (!coupon) return
    setApplying(true)
    setTimeout(() => {
      const c = COUPONS.find(c => c.code.toUpperCase() === coupon.toUpperCase())
      if (!c) {
        alert('優惠碼無效')
        setApplying(false)
        return
      }
      if (getTotal() < c.minSpend) {
        alert(`最低消費 $${c.minSpend} 才能使用此優惠碼`)
        setApplying(false)
        return
      }
      let disc = c.type === 'fixed' ? c.discount : getTotal() * (c.discount / 100)
      setDiscountCode(c.code)
      setDiscount(disc)
      localStorage.setItem('VIVA_discountCode', c.code)
      localStorage.setItem('VIVA_discountAmount', disc.toString())
      alert(`優惠碼已套用！`)
      setApplying(false)
      setCoupon('')
    }, 500)
  }

  const handlePlaceOrder = async () => {
    if (!member) {
      alert('請先登入會員')
      router.push('/login')
      return
    }

    setApplying(true)
    await new Promise(resolve => setTimeout(resolve, 800))

    // Process tickets
    const tickets = cart.filter(item => item.type === 'ticket')
    if (tickets.length > 0) {
      const members = JSON.parse(localStorage.getItem('VIVA_members') || '[]')
      const memberIndex = members.findIndex(m => m.id === member.id)
      if (memberIndex !== -1) {
        if (!members[memberIndex].tickets) members[memberIndex].tickets = []
        tickets.forEach(ticket => {
          members[memberIndex].tickets.push({
            name: ticket.name,
            visits: ticket.visits || 1,
            remaining: ticket.visits || 1,
            purchaseDate: new Date().toISOString()
          })
        })
        localStorage.setItem('VIVA_members', JSON.stringify(members))
        const updatedMember = { ...members[memberIndex] }
        setMember(updatedMember)
        localStorage.setItem('VIVA_member', JSON.stringify(updatedMember))
      }
    }

    // Show payment details
    if (paymentMethod === 'whatsapp' || paymentMethod === 'fps' || paymentMethod === 'payme') {
      setShowPaymentDetails(true)
      setApplying(false)
      return
    }

    // For cash, complete order
    completeOrder()
  }

  const completeOrder = () => {
    clearCart()
    setDiscount(0)
    setDiscountCode('')
    localStorage.removeItem('VIVA_discountCode')
    localStorage.removeItem('VIVA_discountAmount')
    setOrderPlaced(true)
    setApplying(false)
    setShowPaymentDetails(false)
  }

  const finalTotal = getTotal() - Math.round(discount)

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
          <h2 style={{ marginBottom: '10px', color: '#3D3D3D' }}>購物車係空既</h2>
          <p style={{ color: '#8A8A8A', marginBottom: '30px' }}>去睇下有咩野可以買啦！</p>
          <Link href="/products" className="btn btn-primary">去 shopping</Link>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px', maxWidth: '400px' }}>
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>✅</div>
          <h2 style={{ marginBottom: '16px', color: '#4CAF50', fontSize: '24px' }}>訂單完成！</h2>
          <p style={{ color: '#6B6B6B', marginBottom: '30px' }}>多謝購買！<br/>套票已存入您既會員帳戶。</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/member" className="btn btn-primary" style={{ textDecoration: 'none' }}>查看我的套票</Link>
            <Link href="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>返回首頁</Link>
          </div>
        </div>
      </div>
    )
  }

  if (showPaymentDetails) {
    return (
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#FAF8F5' }}>
        <section style={{ padding: '30px 16px', background: '#A68B6A', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', color: '#fff', fontWeight: 400 }}>付款資料</h1>
        </section>
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '30px 16px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>訂單摘要</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span>小計</span>
              <span>${getTotal()}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#4CAF50' }}>
                <span>優惠 ({discountCode})</span>
                <span>-${Math.round(discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #E8E0D5', fontWeight: '700', fontSize: '18px' }}>
              <span>總計</span>
              <span style={{ color: '#A68B6A' }}>${finalTotal}</span>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>付款方式</h3>
            <div style={{ padding: '12px', background: '#FAF8F5', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>{paymentMethods.find(p => p.id === paymentMethod)?.icon}</span>
              <span style={{ fontWeight: '500' }}>{paymentMethods.find(p => p.id === paymentMethod)?.name}</span>
            </div>
          </div>

          {paymentMethod === 'whatsapp' && (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>WhatsApp過數</h3>
              <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '16px' }}>
                請過數到我們既WhatsApp帳戶，並send截圖確認。
              </p>
              <a 
                href="https://wa.me/85212345678?text=我已經過數，訂單編號: BK123"
                className="btn btn-primary"
                style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
              >
                💬 開啟WhatsApp
              </a>
            </div>
          )}

          {paymentMethod === 'fps' && (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>FPS轉數快</h3>
              <div style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: '2' }}>
                <p><strong>銀行戶口：</strong> 123-456-789</p>
                <p><strong>收款人：</strong> VIVA HAIR</p>
                <p><strong>FPS ID：</strong> vivahair123</p>
              </div>
            </div>
          )}

          {paymentMethod === 'payme' && (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>PayMe</h3>
              <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '16px' }}>
                請Scan QR Code過數
              </p>
              <div style={{ textAlign: 'center', padding: '20px', background: '#f5f5f5', borderRadius: '10px' }}>
                [PayMe QR Code]
              </div>
            </div>
          )}

          <button onClick={completeOrder} className="btn btn-primary" style={{ width: '100%', marginBottom: '12px' }}>
            我已過數 ✓
          </button>
          <button onClick={() => setShowPaymentDetails(false)} style={{ width: '100%', padding: '14px', background: 'transparent', border: '1px solid #E8E0D5', borderRadius: '30px', cursor: 'pointer' }}>
            返回
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#FAF8F5' }}>
      <section style={{ padding: '30px 16px', background: '#A68B6A', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', color: '#fff', fontWeight: 400 }}>CART 購物車</h1>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Cart Items */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          {cart.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: i < cart.length - 1 ? '1px solid #E8E0D5' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '28px' }}>{item.emoji}</span>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: '#8A8A8A' }}>{item.type === 'ticket' ? `套票 (${item.visits}次)` : '產品'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {item.type === 'product' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button onClick={() => updateQty(item.id, item.type, item.qty - 1)} style={{ width: '28px', height: '28px', border: '1px solid #E8E0D5', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>-</button>
                    <span style={{ width: '24px', textAlign: 'center', fontSize: '14px' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.type, item.qty + 1)} style={{ width: '28px', height: '28px', border: '1px solid #E8E0D5', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>+</button>
                  </div>
                )}
                <div style={{ minWidth: '70px', textAlign: 'right' }}>
                  <div style={{ fontWeight: '600', color: '#A68B6A' }}>${item.price * item.qty}</div>
                </div>
                <button onClick={() => removeFromCart(item.id, item.type)} style={{ padding: '6px 10px', background: '#ffebee', border: 'none', borderRadius: '6px', color: '#F44336', cursor: 'pointer', fontSize: '12px' }}>刪除</button>
              </div>
            </div>
          ))}
          <button onClick={clearCart} style={{ marginTop: '14px', padding: '8px 14px', background: 'transparent', border: '1px solid #E8E0D5', borderRadius: '6px', color: '#8A8A8A', cursor: 'pointer', fontSize: '13px' }}>
            清空購物車
          </button>
        </div>

        {/* Coupon */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '12px', fontSize: '15px' }}>優惠碼</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="輸入優惠碼" style={{ flex: 1, padding: '14px', border: '1px solid #E8E0D5', borderRadius: '12px', fontSize: '15px' }} />
            <button onClick={handleApplyCoupon} disabled={applying || !coupon} className="btn btn-primary" style={{ padding: '14px 20px' }}>
              {applying ? '...' : '套用'}
            </button>
          </div>
          {discountCode && <p style={{ marginTop: '8px', fontSize: '13px', color: '#4CAF50' }}>✓ 已套用: {discountCode}</p>}
        </div>

        {/* Payment Method */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '14px', fontSize: '15px' }}>付款方式</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {paymentMethods.map(method => (
              <div 
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                style={{ 
                  padding: '14px', 
                  border: `2px solid ${paymentMethod === method.id ? '#A68B6A' : '#E8E0D5'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: paymentMethod === method.id ? '#FAF8F5' : '#fff',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>{method.icon}</div>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>{method.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#6B6B6B' }}>小計</span>
            <span>${getTotal()}</span>
          </div>
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#4CAF50' }}>
              <span>優惠 ({discountCode})</span>
              <span>-${Math.round(discount)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #E8E0D5', fontWeight: '700', fontSize: '20px' }}>
            <span>總計</span>
            <span style={{ color: '#A68B6A' }}>${finalTotal}</span>
          </div>
        </div>

        <button onClick={handlePlaceOrder} disabled={applying} className="btn btn-primary" style={{ width: '100%', padding: '18px', fontSize: '16px' }}>
          {applying ? '處理中...' : '前往付款'}
        </button>
      </div>
    </div>
  )
}
