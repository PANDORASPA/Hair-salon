'use client'

import { useState } from 'react'

const products = [
  { id: 1, name: 'DS100 護髮精華素', category: '護理', price: 680, orig: 880, desc: '深層修復受損髮質，令頭髮更強韌', img: '💆', popular: true },
  { id: 2, name: '头皮護理液', category: '護理', price: 280, orig: 380, desc: '有效改善头皮問題，減少脫髮', img: '🧴', popular: true },
  { id: 3, name: '天然護髮油', category: '護理', price: 180, orig: 220, desc: '滋潤髮絲，防止毛躁', img: '🫒' },
]

const categories = ['全部', '護理', '洗護', '造型']

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)

  const filteredProducts = activeCategory === '全部' 
    ? products 
    : products.filter(p => p.category === activeCategory)

  const addToCart = (product) => {
    setCart([...cart, product])
    alert('已加入購物車')
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)

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
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 16px', background: activeCategory === cat ? '#A68B6A' : 'transparent', color: activeCategory === cat ? '#fff' : '#666', border: '1px solid #ddd', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' }}>
                {cat}
              </button>
            ))}
          </div>
          <button onClick={() => setShowCart(true)} style={{ padding: '10px 20px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', position: 'relative' }}>
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
                    <button onClick={() => addToCart(product)} style={{ padding: '10px 20px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
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
          <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', width: '400px', maxHeight: '80vh', overflow: 'auto' }}>
            <h2 style={{ marginBottom: '20px' }}>🛒 購物車</h2>
            {cart.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '40px 0' }}>購物車係空既</p>
            ) : (
              <>
                {cart.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '14px', color: '#666' }}>${item.price}</div>
                    </div>
                    <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 600 }}>總計：</span>
                    <span style={{ fontSize: '24px', fontWeight: 700, color: '#A68B6A' }}>${cartTotal}</span>
                  </div>
                  <button style={{ width: '100%', padding: '15px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 600 }}>
                    結帳
                  </button>
                </div>
              </>
            )}
            <button onClick={() => setShowCart(false)} style={{ marginTop: '20px', width: '100%', padding: '12px', background: '#f5f5f5', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              關閉
            </button>
          </div>
        </div>
      )}
    </>
  )
}
