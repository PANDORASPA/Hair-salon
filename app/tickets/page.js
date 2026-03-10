'use client'

import { useState } from 'react'
import { useCart } from '../components/CartContext'

const TICKETS = [
  { id: 'basic', name: 'Basic套餐', price: 680, original: 860, visits: 2, emoji: '🎁', desc: '剪髮+護髮' },
  { id: 'premium', name: 'Premium套餐', price: 1280, original: 1680, visits: 2, emoji: '💎', desc: '染髮+護髮' },
  { id: 'luxury', name: 'Luxury套餐', price: 2380, original: 3180, visits: 3, emoji: '👑', desc: '燙髮+護髮+造型' },
  { id: 'annual', name: '年費會員', price: 5800, original: 8800, visits: 12, emoji: '🌟', desc: '全年剪髮' },
]

export default function Tickets() {
  const [selected, setSelected] = useState(null)
  const { addToCart } = useCart()

  const handleAddToCart = (ticket) => {
    addToCart({
      id: 'ticket_' + ticket.id,
      name: ticket.name,
      price: ticket.price,
      emoji: ticket.emoji,
      type: 'ticket',
      visits: ticket.visits
    })
    alert(ticket.name + ' 已加入購物車！')
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#FAF8F5' }}>
      <section style={{ padding: '40px 20px', background: '#A68B6A', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', color: '#fff', fontWeight: 400, letterSpacing: '0.15em' }}>PACKAGES</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '10px' }}>優惠套票 - 慳錢之選</p>
      </section>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {TICKETS.map((ticket, i) => {
            const save = ticket.original - ticket.price
            const percent = Math.round(save / ticket.original * 100)
            
            return (
              <div 
                key={i}
                style={{ 
                  background: '#fff', 
                  border: `2px solid ${selected === ticket.id ? '#A68B6A' : '#E8E0D5'}`,
                  borderRadius: '20px', 
                  padding: '32px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  transform: selected === ticket.id ? 'scale(1.02)' : 'scale(1)',
                }}
                onClick={() => setSelected(ticket.id)}
              >
                <span style={{ 
                  position: 'absolute', 
                  top: '16px', 
                  right: '16px', 
                  background: '#A68B6A', 
                  color: '#fff', 
                  padding: '6px 14px', 
                  borderRadius: '20px', 
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  慳{percent}%
                </span>
                
                <div style={{ fontSize: '48px', marginBottom: '20px', textAlign: 'center' }}>{ticket.emoji}</div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#3D3D3D', textAlign: 'center' }}>{ticket.name}</h3>
                <p style={{ color: '#8A8A8A', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>{ticket.desc}</p>
                
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '36px', fontWeight: '700', color: '#A68B6A' }}>${ticket.price}</span>
                  <span style={{ fontSize: '16px', color: '#8A8A8A', textDecoration: 'line-through', marginLeft: '12px' }}>
                    ${ticket.original}
                  </span>
                </div>
                
                <p style={{ textAlign: 'center', fontSize: '14px', color: '#8A8A8A', marginBottom: '20px' }}>
                  共 {ticket.visits} 次服務
                </p>
                
                <button 
                  onClick={() => handleAddToCart(ticket)}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    background: '#A68B6A',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  加入購物車
                </button>
              </div>
            )
          })}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px', background: '#fff', borderRadius: '12px' }}>
          <p style={{ color: '#6B6B6B', marginBottom: '12px' }}>有問題？可以直接WhatsApp聯絡我們</p>
          <a 
            href="https://wa.me/85212345678" 
            style={{ 
              display: 'inline-block',
              padding: '12px 24px', 
              background: '#25D366',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '25px',
              fontWeight: '500',
            }}
          >
            💬 WhatsApp 查詢
          </a>
        </div>
      </div>
    </div>
  )
}
