'use client'

import { useCart } from '../components/CartContext'

const PRODUCTS = [
  { id: 1, name: 'Kerastase養髮精華', price: 380, emoji: '🧴', desc: '法國專業護髮', stock: 20 },
  { id: 2, name: 'Shiseido洗髮水', price: 280, emoji: '🫧', desc: '日本頂級髮品', stock: 30 },
  { id: 3, name: 'Milbon護髮素', price: 180, emoji: '💧', desc: '日系沙龍專用', stock: 25 },
  { id: 4, name: 'Moroccanoil髮油', price: 320, emoji: '🫒', desc: '摩洛哥堅果油', stock: 15 },
  { id: 5, name: 'Christophe Robin髮膜', price: 450, emoji: '🌿', desc: '深層清潔髮膜', stock: 10 },
  { id: 6, name: 'Olaplex修復液', price: 580, emoji: '🔬', desc: '結構修復', stock: 8 },
]

export default function Products() {
  const { addToCart } = useCart()

  const handleAddToCart = (product) => {
    addToCart({
      id: 'prod_' + product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      type: 'product'
    })
    alert(product.name + ' 已加入購物車！')
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#FAF8F5' }}>
      <section style={{ padding: '40px 20px', background: '#A68B6A', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', color: '#fff', fontWeight: 400, letterSpacing: '0.15em' }}>PRODUCTS</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '10px' }}>專業髮品</p>
      </section>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {PRODUCTS.map((product, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #E8E0D5' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px', textAlign: 'center' }}>{product.emoji}</div>
              <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#3D3D3D' }}>{product.name}</h3>
              <p style={{ color: '#8A8A8A', fontSize: '13px', marginBottom: '16px' }}>{product.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#A68B6A' }}>${product.price}</span>
                <button 
                  onClick={() => handleAddToCart(product)}
                  style={{ padding: '8px 20px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' }}
                >
                  加入購物車
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
