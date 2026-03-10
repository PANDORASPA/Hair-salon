'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Cart Context
const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [cartCount, setCartCount] = useState(0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('VIVA_cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage and update count
  useEffect(() => {
    localStorage.setItem('VIVA_cart', JSON.stringify(cart))
    setCartCount(cart.reduce((sum, item) => sum + item.qty, 0))
  }, [cart])

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.type === item.type)
      if (existing) {
        return prev.map(i => 
          (i.id === item.id && i.type === item.type) 
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const removeFromCart = (id, type) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.type === type)))
  }

  const updateQty = (id, type, qty) => {
    if (qty <= 0) {
      removeFromCart(id, type)
      return
    }
    setCart(prev => prev.map(i => 
      (i.id === id && i.type === type) ? { ...i, qty } : i
    ))
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0)
  }

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, updateQty, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}

// Cart Button Component (for navbar)
export function CartButton() {
  const { cartCount } = useCart()
  
  return (
    <Link href="/cart" style={{ position: 'relative', padding: '8px 12px', color: '#A68B6A' }}>
      🛒
      {cartCount > 0 && (
        <span style={{ 
          position: 'absolute', 
          top: '0', 
          right: '0', 
          background: '#F44336', 
          color: '#fff', 
          borderRadius: '50%', 
          width: '18px', 
          height: '18px', 
          fontSize: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {cartCount}
        </span>
      )}
    </Link>
  )
}
