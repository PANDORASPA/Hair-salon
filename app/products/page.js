'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

const products = [
  { id: 1, name: 'DS100 護髮精華素', category: '護理', price: 680, orig: 880, desc: '深層修復受損髮質，令頭髮更強韌', img: '💆', popular: true },
  { id: 2, name: '头皮護理液', category: '護理', price: 280, orig: 380, desc: '有效改善头皮問題，減少脫髮', img: '🧴', popular: true },
  { id: 3, name: '天然護髮油', category: '護理', price: 180, orig: 220, desc: '滋潤髮絲，防止毛躁', img: '🫒' },
  { id: 4, name: '專業洗髮水', category: '洗護', price: 150, orig: 180, desc: '温和清潔配方，適合每日使用', img: '🧴' },
  { id: 5, name: '髮泥定型', category: '造型', price: 120, orig: 150, desc: '強效定型，全日持久', img: '💈' },
  { id: 6, name: '髮蠟', category: '造型', price: 100, orig: 120, desc: '自然造型，唔會過硬', img: '💇' },
]

const categories = ['全部', '護理', '洗護', '造型']

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [user, setUser] = useState(null)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderRef, setOrderRef] = useState('')
  
  // 表單資料
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    delivery: '門市取貨',
    payment: '現金'
  })

  useEffect(() => {
    // 讀取購物車
    const savedCart = localStorage.getItem('viva_cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    
    // 讀取用戶
    const currentUser = localStorage.getItem('viva_current_user')
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      setUser(userData)
      setFormData(prev => ({ ...prev, name: userData.name || '', phone: userData.phone || '' }))
    }
  }, [])

  const filteredProducts = activeCategory === '全部' 
    ? products 
    : products.filter(p => p.category === activeCategory)

  const addToCart = (product) => {
    const newCart = [...cart, product]
    setCart(newCart)
    localStorage.setItem('viva_cart', JSON.stringify(newCart))
  }

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index)
    setCart(newCart)
    localStorage.setItem('viva_cart', JSON.stringify(newCart))
  }

  const updateQuantity = (index, change) => {
    const newCart = [...cart]
    if (change === 'increase') {
      newCart.push(newCart[index])
    } else if (change === 'decrease' && newCart.filter((_, i) => i === index).length > 1) {
      newCart.splice(index, 1)
    }
    setCart(newCart)
    localStorage.setItem('viva_cart', JSON.stringify(newCart))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)
  const deliveryFee = formData.delivery === '送貨上門' ? 50 : 0
  const finalTotal = cartTotal + deliveryFee

  const handleCheckout = () => {
    if (!user) {
      alert('請先登入會員')
      window.location.href = '/login'
      return
    }
    setShowCheckout(true)
    setCheckoutStep(1)
  }

  const handlePlaceOrder = async () => {
    // 驗證
    if (!formData.name || !formData.phone) {
      alert('請填寫聯絡資料')
      return
    }

    // 生成訂單編號
    const ref = 'ORD' + Date.now().toString().slice(-6)
    setOrderRef(ref)

    // 建立訂單
    const order = {
      ref,
      user_id: user.id,
      user_name: user.name,
      items: JSON.stringify(cart),
      total: finalTotal,
      delivery: formData.delivery,
      payment: formData.payment,
      address: formData.address || null,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    // 保存訂單到 Supabase
    const { error: orderError } = await supabase
      .from('orders')
      .insert([order])

    if (orderError) {
      console.error('Error creating order:', orderError)
      alert('訂單失敗，請稍後再試')
      return
    }

    // 更新用戶積分
    const pointsEarned = Math.floor(finalTotal)
    const { data: currentUser } = await supabase
      .from('users')
      .select('points')
      .eq('id', user.id)
      .single()

    if (currentUser) {
      await supabase
        .from('users')
        .update({ points: (currentUser.points || 0) + pointsEarned })
        .eq('id', user.id)
    }

    // 清空購物車
    setCart([])
    localStorage.setItem('viva_cart', '[]')
    
    setOrderPlaced(true)
  }

  // 訂單成功
  if (orderPlaced) {
    return (
      <>
        <section style={{ padding: '60px 20px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ color: '#A68B6A', marginBottom: '15px', fontSize: '28px' }}>訂單已送出！</h2>
            <p style={{ color: '#666', marginBottom: '10px' }}>訂單編號：<strong>{orderRef}</strong></p>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              {formData.delivery === '門市取貨' 
                ? '請於營業時間內到門市取貨' 
                : '我們會盡快安排送貨'}
            </p>
            <div style={{ background: '#FAF8F5', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
              <p style={{ color: '#A68B6A', fontWeight: 600 }}>💎 獲得 {Math.floor(finalTotal)} 積分</p>
            </div>
            <Link href="/" style={{ display: 'inline-block', padding: '14px 30px', background: '#A68B6A', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
              返回首頁
            </Link>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section style={{ padding: '40px 0', background: '#FAF8F5', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', color: '#3D3D3D' }}>產品<span style={{ color: '#A68B6A' }}>商店</span></h1>
      </section>

      {/* Filter */}
      <div style={{ background: '#fff', padding: '20px 0', borderBottom: '1px solid #eee' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                style={{ 
                  padding: '8px 16px', 
                  background: activeCategory === cat ? '#A68B6A' : 'transparent', 
                  color: activeCategory === cat ? '#fff' : '#666', 
                  border: '1px solid #ddd', 
                  borderRadius: '20px', 
                  cursor: 'pointer', 
                  fontSize: '14px' 
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowCart(true)} 
            style={{ 
              padding: '10px 20px', 
              background: '#A68B6A', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              position: 'relative' 
            }}
          >
            🛒 購物車 ({cart.length})
          </button>
        </div>
      </div>

      {/* Products */}
      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {filteredProducts.map(product => (
              <div key={product.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ height: '180px', background: 'linear-gradient(135deg, #f5f5f5, #e8e8e8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', position: 'relative' }}>
                  {product.img}
                  {product.popular && <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#A68B6A', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>熱賣</span>}
                </div>
                <div style={{ padding: '20px' }}>
                  <span style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>{product.category}</span>
                  <h3 style={{ fontSize: '18px', margin: '8px 0' }}>{product.name}</h3>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>{product.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '24px', fontWeight: 700, color: '#A68B6A' }}>${product.price}</span>
                      <span style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through', marginLeft: '10px' }}>${product.orig}</span>
                    </div>
                    <button 
                      onClick={() => addToCart(product)} 
                      style={{ 
                        padding: '10px 20px', 
                        background: '#A68B6A', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontWeight: 600 
                      }}
                    >
                      加入
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Modal */}
      {showCart && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', width: '90%', maxWidth: '450px', maxHeight: '85vh', overflow: 'auto' }}>
            <h2 style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              🛒 購物車
              <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
            </h2>
            
            {cart.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '40px 0' }}>購物車係空既</p>
            ) : (
              <>
                {/* 購物車項目 */}
                <div style={{ marginBottom: '20px' }}>
                  {cart.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px' }}>{item.img}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.name}</div>
                          <div style={{ fontSize: '14px', color: '#A68B6A', fontWeight: 600 }}>${item.price}</div>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px' }}>✕</button>
                    </div>
                  ))}
                </div>

                {/* 總計 */}
                <div style={{ padding: '20px', background: '#FAF8F5', borderRadius: '8px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>商品總計：</span>
                    <span>${cartTotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '18px', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
                    <span>總計：</span>
                    <span style={{ color: '#A68B6A' }}>${cartTotal}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  style={{ 
                    width: '100%', 
                    padding: '15px', 
                    background: 'linear-gradient(135deg, #A68B6A, #8B7355)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontSize: '16px', 
                    fontWeight: 600 
                  }}
                >
                  前往結帳
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              結帳
              <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
            </h2>

            {/* 進度 */}
            <div style={{ display: 'flex', marginBottom: '30px', gap: '10px' }}>
              <div style={{ flex: 1, padding: '10px', background: checkoutStep >= 1 ? '#A68B6A' : '#ddd', color: checkoutStep >= 1 ? '#fff' : '#666', borderRadius: '8px', textAlign: 'center', fontSize: '12px' }}>1. 確認商品</div>
              <div style={{ flex: 1, padding: '10px', background: checkoutStep >= 2 ? '#A68B6A' : '#ddd', color: checkoutStep >= 2 ? '#fff' : '#666', borderRadius: '8px', textAlign: 'center', fontSize: '12px' }}>2. 送貨資料</div>
              <div style={{ flex: 1, padding: '10px', background: checkoutStep >= 3 ? '#A68B6A' : '#ddd', color: checkoutStep >= 3 ? '#fff' : '#666', borderRadius: '8px', textAlign: 'center', fontSize: '12px' }}>3. 確認訂單</div>
            </div>

            {/* Step 1: 確認商品 */}
            {checkoutStep === 1 && (
              <>
                <h3 style={{ marginBottom: '15px' }}>📦 訂單摘要</h3>
                {cart.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <span>{item.name}</span>
                    <span style={{ fontWeight: 600 }}>${item.price}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', fontWeight: 600, fontSize: '18px' }}>
                  <span>總計：</span>
                  <span style={{ color: '#A68B6A' }}>${cartTotal}</span>
                </div>
                <button 
                  onClick={() => setCheckoutStep(2)}
                  style={{ width: '100%', padding: '14px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, marginTop: '20px' }}
                >
                  下一步
                </button>
              </>
            )}

            {/* Step 2: 送貨資料 */}
            {checkoutStep === 2 && (
              <>
                <h3 style={{ marginBottom: '15px' }}>📝 送貨資料</h3>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600, fontSize: '14px' }}>姓名 *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600, fontSize: '14px' }}>電話 *</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600, fontSize: '14px' }}>取貨方式</label>
                  <select 
                    value={formData.delivery}
                    onChange={(e) => setFormData({...formData, delivery: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                  >
                    <option>門市取貨</option>
                    <option>送貨上門 (+$50)</option>
                  </select>
                </div>
                {formData.delivery === '送貨上門' && (
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600, fontSize: '14px' }}>送貨地址</label>
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="請輸入送貨地址"
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                    />
                  </div>
                )}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600, fontSize: '14px' }}>付款方式</label>
                  <select 
                    value={formData.payment}
                    onChange={(e) => setFormData({...formData, payment: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                  >
                    <option>現金</option>
                    <option>轉數快</option>
                    <option>PayMe</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => setCheckoutStep(1)}
                    style={{ flex: 1, padding: '14px', background: '#fff', color: '#666', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    返回
                  </button>
                  <button 
                    onClick={() => setCheckoutStep(3)}
                    style={{ flex: 1, padding: '14px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    下一步
                  </button>
                </div>
              </>
            )}

            {/* Step 3: 確認訂單 */}
            {checkoutStep === 3 && (
              <>
                <h3 style={{ marginBottom: '15px' }}>✅ 確認訂單</h3>
                <div style={{ background: '#FAF8F5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                  <p><strong>客戶：</strong>{formData.name}</p>
                  <p><strong>電話：</strong>{formData.phone}</p>
                  <p><strong>取貨方式：</strong>{formData.delivery}</p>
                  <p><strong>付款方式：</strong>{formData.payment}</p>
                </div>
                <div style={{ padding: '15px', background: '#FAF8F5', borderRadius: '8px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>商品總計：</span>
                    <span>${cartTotal}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span>送貨費：</span>
                      <span>${deliveryFee}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '20px', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
                    <span>總計：</span>
                    <span style={{ color: '#A68B6A' }}>${finalTotal}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => setCheckoutStep(2)}
                    style={{ flex: 1, padding: '14px', background: '#fff', color: '#666', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    返回
                  </button>
                  <button 
                    onClick={handlePlaceOrder}
                    style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #A68B6A, #8B7355)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    確認訂單
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
