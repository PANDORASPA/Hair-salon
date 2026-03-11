'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('bookings')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const ADMIN_PASSWORD = 'viva2026'

  const [shopSettings, setShopSettings] = useState({
    shopName: 'VIVA HAIR', phone: '1234 5678', address: '九龍太子通菜街17A 1樓',
    openTime: '09:00', closeTime: '19:00', closedDay: '1', enableOnlineBooking: true,
  })

  const [services, setServices] = useState([
    { id: 1, name: '剪髮', price: 280, time: 60, enabled: true },
    { id: 2, name: '染髮', price: 680, time: 120, enabled: true },
    { id: 3, name: '燙髮', price: 880, time: 150, enabled: true },
    { id: 4, name: '護髮', price: 380, time: 60, enabled: true },
    { id: 5, name: '头皮护理', price: 450, time: 45, enabled: true },
  ])

  const [products, setProducts] = useState([
    { id: 1, name: 'DS100 護髮精華素', price: 680, stock: 10, enabled: true },
    { id: 2, name: '头皮護理液', price: 280, stock: 20, enabled: true },
    { id: 3, name: '天然護髮油', price: 180, stock: 15, enabled: true },
  ])

  const [coupons, setCoupons] = useState([
    { id: 1, code: 'NEW20', name: '新客8折', discount: 20, type: 'percent', enabled: true },
    { id: 2, code: 'SAVE100', name: '節省$100', discount: 100, type: 'fixed', minSpend: 500, enabled: true },
  ])

  const tabs = [
    { id: 'bookings', name: '📅 預約' },
    { id: 'shop', name: '🏪 店鋪' },
    { id: 'services', name: '✂️ 服務' },
    { id: 'products', name: '🛍️ 產品' },
    { id: 'coupons', name: '🎫 優惠' },
  ]

  useEffect(() => {
    const auth = localStorage.getItem('viva_admin_auth')
    if (auth === 'true') { setIsAuthenticated(true); fetchData() }
    else setLoading(false)
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data: b } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
    if (b) setBookings(b)
    setLoading(false)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('viva_admin_auth', 'true')
      setIsAuthenticated(true)
      fetchData()
    } else setError('密碼錯誤')
  }

  const handleLogout = () => {
    localStorage.removeItem('viva_admin_auth')
    setIsAuthenticated(false)
    router.push('/')
  }

  const updateStatus = async (ref, status) => {
    await supabase.from('bookings').update({ status }).eq('ref', ref)
    setBookings(bookings.map(b => b.ref === ref ? { ...b, status } : b))
  }

  const deleteBooking = async (ref) => {
    if (confirm('確定刪除？')) {
      await supabase.from('bookings').delete().eq('ref', ref)
      setBookings(bookings.filter(b => b.ref !== ref))
    }
  }

  const saveSettings = async (table, data) => {
    setSaving(true)
    for (const item of data) {
      await supabase.from(table).upsert(item, { onConflict: 'id' })
    }
    alert('已保存！')
    setSaving(false)
  }

  const addItem = (type) => {
    const id = Date.now()
    if (type === 'services') setServices([...services, { id, name: '新服務', price: 0, time: 60, enabled: true }])
    if (type === 'products') setProducts([...products, { id, name: '新產品', price: 0, stock: 0, enabled: true }])
    if (type === 'coupons') setCoupons([...coupons, { id, code: 'NEW', name: '新優惠', discount: 10, type: 'percent', enabled: true }])
  }

  const updateItem = (type, index, field, value) => {
    if (type === 'services') { const n = [...services]; n[index][field] = value; setServices(n) }
    if (type === 'products') { const n = [...products]; n[index][field] = value; setProducts(n) }
    if (type === 'coupons') { const n = [...coupons]; n[index][field] = value; setCoupons(n) }
  }

  if (!isAuthenticated) {
    return (
      <><section style={{ padding: '40px 0', background: '#FAF8F5', textAlign: 'center' }}><h1 style={{ fontSize: '32px' }}>管理<span style={{ color: '#A68B6A' }}>後台</span></h1></section>
      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', background: '#fff', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔐</div>
          <h2>請輸入密碼</h2>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="密碼" style={{ width: '100%', padding: '14px', margin: '20px 0', border: error ? '2px solid #f00' : '2px solid #ddd', borderRadius: '8px', fontSize: '16px' }} />
            <button type="submit" style={{ width: '100%', padding: '14px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600 }}>登入</button>
          </form>
        </div>
      </section></>
    )
  }

  return (
    <>
      <header style={{ background: '#3D3D3D', color: '#fff', padding: '16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '20px' }}>管理後台</h1>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'transparent', color: '#fff', border: '1px solid #666', borderRadius: '6px', cursor: 'pointer' }}>登出</button>
        </div>
      </header>

      <div style={{ background: '#fff', borderBottom: '1px solid #eee', overflowX: 'auto' }}>
        <div style={{ display: 'flex', maxWidth: '800px', margin: '0 auto' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '16px 20px', background: activeTab === t.id ? '#A68B6A' : 'transparent', color: activeTab === t.id ? '#fff' : '#666', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' }}>{t.name}</button>
          ))}
        </div>
      </div>

      <section style={{ padding: '24px 16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {activeTab === 'bookings' && (
            <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead><tr style={{ background: '#FAF8F5' }}><th style={{ padding: '12px', textAlign: 'left' }}>編號</th><th style={{ padding: '12px', textAlign: 'left' }}>客戶</th><th style={{ padding: '12px', textAlign: 'left' }}>服務</th><th style={{ padding: '12px', textAlign: 'left' }}>日期</th><th style={{ padding: '12px', textAlign: 'left' }}>狀態</th><th style={{ padding: '12px', textAlign: 'left' }}>操作</th></tr></thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{b.ref}</td>
                      <td style={{ padding: '12px' }}><div>{b.name}</div><div style={{ fontSize: '12px', color: '#999' }}>{b.phone}</div></td>
                      <td style={{ padding: '12px' }}>{b.service}</td>
                      <td style={{ padding: '12px' }}>{b.date} {b.time}</td>
                      <td style={{ padding: '12px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: b.status === 'pending' ? '#fef3c7' : '#dcfce7', color: b.status === 'pending' ? '#92400e' : '#16a34a' }}>{b.status === 'pending' ? '待確認' : '已確認'}</span></td>
                      <td style={{ padding: '12px' }}>{b.status === 'pending' && <button onClick={() => updateStatus(b.ref, 'confirmed')} style={{ marginRight: '4px', padding: '4px 8px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>確認</button>}<button onClick={() => deleteBooking(b.ref)} style={{ padding: '4px 8px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>刪除</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'shop' && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '20px' }}>🏪 店鋪設定</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>店鋪名稱</label><input type="text" value={shopSettings.shopName} onChange={e => setShopSettings({...shopSettings, shopName: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>電話</label><input type="text" value={shopSettings.phone} onChange={e => setShopSettings({...shopSettings, phone: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>地址</label><input type="text" value={shopSettings.address} onChange={e => setShopSettings({...shopSettings, address: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>營業時間</label><input type="time" value={shopSettings.openTime} onChange={e => setShopSettings({...shopSettings, openTime: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                  <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>關門時間</label><input type="time" value={shopSettings.closeTime} onChange={e => setShopSettings({...shopSettings, closeTime: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                </div>
                <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>休息日</label><select value={shopSettings.closedDay} onChange={e => setShopSettings({...shopSettings, closedDay: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}><option value="0">星期日</option><option value="1">星期一</option><option value="2">星期二</option><option value="3">星期三</option><option value="4">星期四</option><option value="5">星期五</option><option value="6">星期六</option></select></div>
                <button onClick={() => alert('設定已保存')} style={{ padding: '14px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginTop: '10px' }}>保存設定</button>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}><h3>✂️ 服務項目</h3><button onClick={() => addItem('services')} style={{ padding: '8px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ 新增</button></div>
              {services.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '12px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '10px' }}>
                  <input type="checkbox" checked={s.enabled} onChange={e => updateItem('services', i, 'enabled', e.target.value)} />
                  <input type="text" value={s.name} onChange={e => updateItem('services', i, 'name', e.target.value)} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                  <input type="number" value={s.price} onChange={e => updateItem('services', i, 'price', parseInt(e.target.value))} style={{ width: '70px', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                  <input type="number" value={s.time} onChange={e => updateItem('services', i, 'time', parseInt(e.target.value))} style={{ width: '60px', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                  <span>分</span>
                </div>
              ))}
              <button onClick={() => saveSettings('services', services)} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginTop: '10px' }}>{saving ? '保存中...' : '保存服務'}</button>
            </div>
          )}

          {activeTab === 'products' && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}><h3>🛍️ 產品</h3><button onClick={() => addItem('products')} style={{ padding: '8px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ 新增</button></div>
              {products.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '12px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '10px' }}>
                  <input type="checkbox" checked={p.enabled} onChange={e => updateItem('products', i, 'enabled', e.target.value)} />
                  <input type="text" value={p.name} onChange={e => updateItem('products', i, 'name', e.target.value)} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                  <input type="number" value={p.price} onChange={e => updateItem('products', i, 'price', parseInt(e.target.value))} style={{ width: '70px', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                  <input type="number" value={p.stock} onChange={e => updateItem('products', i, 'stock', parseInt(e.target.value))} style={{ width: '60px', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                  <span>件</span>
                </div>
              ))}
              <button onClick={() => saveSettings('products', products)} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginTop: '10px' }}>{saving ? '保存中...' : '保存產品'}</button>
            </div>
          )}

          {activeTab === 'coupons' && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}><h3>🎫 優惠碼</h3><button onClick={() => addItem('coupons')} style={{ padding: '8px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ 新增</button></div>
              {coupons.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '12px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <input type="checkbox" checked={c.enabled} onChange={e => updateItem('coupons', i, 'enabled', e.target.value)} />
                  <input type="text" value={c.code} onChange={e => updateItem('coupons', i, 'code', e.target.value.toUpperCase())} style={{ width: '80px', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', textTransform: 'uppercase' }} />
                  <input type="text" value={c.name} onChange={e => updateItem('coupons', i, 'name', e.target.value)} style={{ flex: 1, minWidth: '100px', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                  <input type="number" value={c.discount} onChange={e => updateItem('coupons', i, 'discount', parseInt(e.target.value))} style={{ width: '60px', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                  <select value={c.type} onChange={e => updateItem('coupons', i, 'type', e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}><option value="percent">%</option><option value="fixed">$</option></select>
                </div>
              ))}
              <button onClick={() => saveSettings('coupons', coupons)} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginTop: '10px' }}>{saving ? '保存中...' : '保存優惠碼'}</button>
            </div>
          )}

        </div>
      </section>
    </>
  )
}
