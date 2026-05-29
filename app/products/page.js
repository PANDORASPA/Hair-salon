'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

const CART_KEY = 'pandora_cart'
const ALL_CATEGORY = '全部'

const formatCurrency = (value) => `$${Math.round(Number(value || 0))}`

const getPaymentOptions = (settings = {}) => {
  const options = []
  if (settings.stripe_enabled !== 'false' && settings.stripe_checkout_ready === 'true') {
    options.push({ value: 'stripe', label: 'Stripe 網上付款' })
  }
  if (settings.manual_payment_enabled !== 'false') {
    options.push({ value: 'cash', label: '人工確認付款' })
  }
  if (settings.fps_enabled === 'true') {
    options.push({ value: 'fps', label: 'FPS / 轉數快' })
  }
  if (settings.pay_at_shop_enabled === 'true') {
    options.push({ value: 'pay_at_shop', label: '到店付款' })
  }
  return options.length ? options : [{ value: 'cash', label: '人工確認付款' }]
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([ALL_CATEGORY])
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderRef, setOrderRef] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [settings, setSettings] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    delivery: 'pickup',
    payment: 'cash',
  })

  const paymentOptions = useMemo(() => getPaymentOptions(settings), [settings])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [productsRes, authRes, settingsRes] = await Promise.all([
        supabase.from('products').select('*').eq('enabled', true).order('id'),
        supabase.auth.getUser(),
        fetch('/api/public/settings', { cache: 'no-store' }).then((response) => response.json()).catch(() => ({})),
      ])

      const loadedProducts = productsRes?.data || []
      const loadedSettings = settingsRes?.settings || {}
      const options = getPaymentOptions(loadedSettings)

      setProducts(loadedProducts)
      setSettings(loadedSettings)
      setCategories([ALL_CATEGORY, ...new Set(loadedProducts.map((item) => item.category).filter(Boolean))])
      setFormData((current) => ({
        ...current,
        payment: options.some((option) => option.value === current.payment) ? current.payment : options[0].value,
      }))

      const user = authRes?.data?.user || null
      if (user) {
        const { data: profile } = await supabase.from('member_profiles').select('full_name, phone').eq('id', user.id).maybeSingle()
        setFormData((current) => ({
          ...current,
          name: profile?.full_name || current.name,
          phone: profile?.phone || current.phone,
        }))
      }

      setLoading(false)
    }

    load()

    const savedCart = localStorage.getItem(CART_KEY)
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch {
        localStorage.removeItem(CART_KEY)
      }
    }

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user || null
      if (!user) return

      const { data: profile } = await supabase.from('member_profiles').select('full_name, phone').eq('id', user.id).maybeSingle()
      setFormData((current) => ({
        ...current,
        name: profile?.full_name || current.name,
        phone: profile?.phone || current.phone,
      }))
    })

    return () => sub?.subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  const filteredProducts = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return products
    return products.filter((item) => item.category === activeCategory)
  }, [activeCategory, products])

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + Number(item.price || 0), 0), [cart])
  const selectedDeliveryLabel = formData.delivery === 'delivery' ? '送貨' : '到店取貨'
  const selectedPaymentLabel = paymentOptions.find((option) => option.value === formData.payment)?.label || formData.payment

  const addToCart = (product) => {
    setCart((current) => [...current, { ...product, cartId: Date.now() + Math.random(), quantity: 1 }])
    toast.success(`${product.name} 已加入購物車`)
  }

  const removeFromCart = (cartId) => {
    setCart((current) => current.filter((item) => item.cartId !== cartId))
  }

  const handleCheckout = () => {
    if (!formData.name || !formData.phone) {
      toast.error('請先填寫姓名和電話')
      return
    }

    if (formData.delivery === 'delivery' && !formData.address.trim()) {
      toast.error('送貨訂單需要填寫地址')
      return
    }

    if (!paymentOptions.some((option) => option.value === formData.payment)) {
      toast.error('請選擇可用付款方式')
      return
    }

    setCheckoutStep(2)
  }

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.phone) {
      toast.error('請先填寫姓名和電話')
      return
    }

    if (cart.length === 0) {
      toast.error('購物車是空的')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          delivery: formData.delivery,
          payment: formData.payment,
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity || 1,
          })),
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload?.error || '建立訂單失敗')
      }

      setOrderRef(payload?.ref || '')
      if (payload?.checkoutUrl) {
        toast.success('正在前往 Stripe 付款頁')
        window.location.href = payload.checkoutUrl
        return
      }
      setOrderPlaced(true)
      setCart([])
      setShowCheckout(false)
      setCheckoutStep(1)
      localStorage.removeItem(CART_KEY)
      toast.success('訂單已建立，我們會盡快跟進')
    } catch (error) {
      toast.error(`下單失敗：${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="vh-loading">載入中...</div>
  }

  return (
    <>
      <section className="vh-page-hero">
        <span className="vh-eyebrow">Care products</span>
        <h1>
          頭皮與頭髮<span>護理產品</span>
        </h1>
        <p>精選適合日常頭皮潔淨、保濕和舒緩護理的產品。產品可到店取貨；如需送貨，請先與店員確認安排。</p>
      </section>

      <section className="vh-section">
        <div className="vh-container">
          <div className="vh-chip-row vh-category-row">
            {categories.map((category) => (
              <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`vh-chip-button ${activeCategory === category ? 'active' : ''}`}>
                {category}
              </button>
            ))}
          </div>

          <div className="vh-product-grid">
            {filteredProducts.map((product) => (
              <article key={product.id} className="vh-product-card">
                <div className="vh-product-media">{product.emoji || 'SP'}</div>
                <div className="vh-product-body">
                  <h3>{product.name}</h3>
                  <p>{product.description || '日常頭皮與頭髮護理產品。'}</p>
                  <div className="vh-product-bottom">
                    <div>
                      <strong>{formatCurrency(product.price)}</strong>
                      {Number(product.orig) > Number(product.price) ? <span>{formatCurrency(product.orig)}</span> : null}
                    </div>
                    <button type="button" onClick={() => addToCart(product)} className="vh-small-btn">
                      加入
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 ? <div className="vh-empty-card">暫時沒有上架產品</div> : null}
        </div>
      </section>

      {cart.length > 0 && (
        <div className="vh-floating-cart">
          <button type="button" onClick={() => setShowCart(true)} className="vh-btn vh-btn-primary">
            購物車 ({cart.length})
          </button>
        </div>
      )}

      {showCart && (
        <Dialog onClose={() => setShowCart(false)}>
          <div className="vh-dialog-head">
            <h3>購物車 ({cart.length})</h3>
            <button type="button" onClick={() => setShowCart(false)} aria-label="關閉">
              x
            </button>
          </div>

          <div className="vh-dialog-list">
            {cart.map((item) => (
              <div key={item.cartId} className="vh-dialog-row">
                <div>
                  <strong>{item.name}</strong>
                  <span>{formatCurrency(item.price)}</span>
                </div>
                <button type="button" onClick={() => removeFromCart(item.cartId)}>
                  刪除
                </button>
              </div>
            ))}
          </div>

          <div className="vh-dialog-total">總計：{formatCurrency(cartTotal)}</div>
          <button
            type="button"
            onClick={() => {
              setShowCart(false)
              setShowCheckout(true)
            }}
            className="vh-btn vh-btn-primary vh-full-btn"
          >
            前往結賬
          </button>
        </Dialog>
      )}

      {showCheckout && (
        <Dialog onClose={() => setShowCheckout(false)}>
          <div className="vh-dialog-head">
            <h3>產品結賬</h3>
            <button type="button" onClick={() => setShowCheckout(false)} aria-label="關閉">
              x
            </button>
          </div>

          {checkoutStep === 1 && (
            <div className="vh-form-grid">
              <input value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} placeholder="姓名" />
              <input value={formData.phone} onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))} placeholder="電話" />
              <select value={formData.delivery} onChange={(event) => setFormData((current) => ({ ...current, delivery: event.target.value }))}>
                <option value="pickup">到店取貨</option>
                <option value="delivery">送貨</option>
              </select>
              {formData.delivery === 'delivery' && (
                <textarea value={formData.address} onChange={(event) => setFormData((current) => ({ ...current, address: event.target.value }))} placeholder="送貨地址" rows={3} />
              )}
              <select value={formData.payment} onChange={(event) => setFormData((current) => ({ ...current, payment: event.target.value }))}>
                {paymentOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              {settings.product_fulfillment_note ? <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '13px', lineHeight: 1.6 }}>{settings.product_fulfillment_note}</p> : null}
              <button type="button" onClick={handleCheckout} className="vh-btn vh-btn-primary vh-full-btn">
                下一步
              </button>
            </div>
          )}

          {checkoutStep === 2 && (
            <div className="vh-confirm-box">
              <div className="vh-summary-card">
                <p><strong>姓名：</strong> {formData.name}</p>
                <p><strong>電話：</strong> {formData.phone}</p>
                <p><strong>取貨方式：</strong> {selectedDeliveryLabel}</p>
                {formData.delivery === 'delivery' ? <p><strong>地址：</strong> {formData.address}</p> : null}
                <p><strong>付款方式：</strong> {selectedPaymentLabel}</p>
              </div>
              <div className="vh-dialog-list">
                {cart.map((item) => (
                  <div key={item.cartId} className="vh-dialog-row">
                    <span>{item.name}</span>
                    <strong>{formatCurrency(item.price)}</strong>
                  </div>
                ))}
              </div>
              <div className="vh-dialog-total">總計：{formatCurrency(cartTotal)}</div>
              <button type="button" onClick={handlePlaceOrder} disabled={submitting} className="vh-btn vh-btn-primary vh-full-btn">
                {submitting ? '提交中...' : '確認下單'}
              </button>
              <button type="button" onClick={() => setCheckoutStep(1)} className="vh-btn vh-btn-secondary vh-full-btn">
                返回修改
              </button>
            </div>
          )}
        </Dialog>
      )}

      {orderPlaced && (
        <Dialog onClose={() => setOrderPlaced(false)}>
          <div className="vh-success-box">
            <div className="vh-success-mark">OK</div>
            <h3>訂單已建立</h3>
            <p>我們已收到你的產品訂單，店舖會按你選擇的送貨或自取方式跟進。</p>
            {orderRef ? <strong>訂單編號：{orderRef}</strong> : null}
            <Link href="/account" className="vh-btn vh-btn-primary vh-full-btn">
              前往會員中心
            </Link>
            <button type="button" onClick={() => setOrderPlaced(false)} className="vh-btn vh-btn-secondary vh-full-btn">
              繼續瀏覽
            </button>
          </div>
        </Dialog>
      )}
    </>
  )
}

function Dialog({ children, onClose }) {
  return (
    <div className="vh-dialog-backdrop" onClick={onClose}>
      <div className="vh-dialog" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
