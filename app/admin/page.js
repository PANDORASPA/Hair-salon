'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const ADMIN_PASSWORD = 'viva2026'

  // Data states
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [products, setProducts] = useState([])
  const [coupons, setCoupons] = useState([])
  const [users, setUsers] = useState([])
  const [staff, setStaff] = useState([])
  const [settings, setSettings] = useState({
    shopName: 'VIVA HAIR', phone: '1234 5678', address: '九龍太子通菜街17A 1樓',
    openTime: '11:00', closeTime: '20:00', closedDay: '1', slotDuration: 60, bufferTime: 15,
    enableOnlineBooking: true, bookingNotice: '請提前一天預約', cancelPolicy: '提前一天取消'
  })

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  const tabs = [
    { id: 'dashboard', name: '📊 Dashboard' },
    { id: 'bookings', name: '📅 預約管理' },
    { id: 'staff', name: '💇 員工設定' },
    { id: 'services', name: '✂️ 服務設定' },
    { id: 'time-slots', name: '⏰ 時段設定' },
    { id: 'coupons', name: '🎫 優惠碼' },
    { id: 'customers', name: '👥 客戶管理' },
    { id: 'settings', name: '⚙️ 店鋪設定' },
  ]

  useEffect(() => {
    const auth = localStorage.getItem('viva_admin_auth')
    if (auth === 'true') { setIsAuthenticated(true); fetchData() }
    else setLoading(false)
  }, [])

  const fetchData = async () => {
    setLoading(true)
    
    // Fetch bookings
    const { data: b } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
    if (b) setBookings(b)

    // Fetch services
    const { data: s } = await supabase.from('services').select('*').order('sort_order')
    if (s) setServices(s)

    // Fetch products
    const { data: p } = await supabase.from('products').select('*').order('sort_order')
    if (p) setProducts(p)

    // Fetch coupons
    const { data: c } = await supabase.from('coupons').select('*')
    if (c) setCoupons(c)

    // Fetch users
    const { data: u } = await supabase.from('users').select('*').order('created_at', { ascending: false })
    if (u) setUsers(u)

    // Fetch staff
    const { data: st } = await supabase.from('staff').select('*').order('id')
    if (st) setStaff(st.length > 0 ? st : [{ id: 1, name: '髮型師A', role: '髮型師', phone: '', enabled: true }, { id: 2, name: '髮型師B', role: '髮型師', phone: '', enabled: true }])

    // Fetch settings
    const { data: set } = await supabase.from('settings').select('value').eq('key', 'shop_settings').single()
    if (set?.value) setSettings({ ...settings, ...JSON.parse(set.value) })

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

  // Booking actions
  const updateStatus = async (id, status) => {
    await supabase.from('bookings').update({ status }).eq('id', id)
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b))
  }

  const deleteBooking = async (id) => {
    if (confirm('確定刪除？')) {
      await supabase.from('bookings').delete().eq('id', id)
      setBookings(bookings.filter(b => b.id !== id))
    }
  }

  // Service actions
  const saveServices = async () => {
    setSaving(true)
    for (const s of services) {
      await supabase.from('services').upsert({ ...s, sort_order: s.id })
    }
    alert('已保存')
    setSaving(false)
  }

  const addService = () => {
    const newId = Math.max(...services.map(s => s.id), 0) + 1
    setServices([...services, { id: newId, name: '新服務', price: 0, time: 60, category: '剪髮', enabled: true, sort_order: newId }])
  }

  // Staff actions
  const saveStaff = async () => {
    setSaving(true)
    for (const s of staff) {
      await supabase.from('staff').upsert(s)
    }
    alert('已保存')
    setSaving(false)
  }

  const addStaff = () => {
    const newId = Math.max(...staff.map(s => s.id), 0) + 1
    setStaff([...staff, { id: newId, name: '新員工', role: '髮型師', phone: '', enabled: true }])
  }

  // Coupon actions
  const saveCoupons = async () => {
    setSaving(true)
    for (const c of coupons) {
      await supabase.from('coupons').upsert(c)
    }
    alert('已保存')
    setSaving(false)
  }

  const addCoupon = () => {
    const newId = Math.max(...coupons.map(c => c.id), 0) + 1
    setCoupons([...coupons, { id: newId, code: 'NEW', name: '新優惠', discount: 10, type: 'percent', min_spend: 0, enabled: true }])
  }

  // Settings actions
  const saveSettings = async () => {
    setSaving(true)
    await supabase.from('settings').upsert({ key: 'shop_settings', value: JSON.stringify(settings) }, { onConflict: 'key' })
    alert('已保存')
    setSaving(false)
  }

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const matchSearch = !searchTerm || b.name?.includes(searchTerm) || b.phone?.includes(searchTerm)
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    const matchDate = !dateFilter || b.date === dateFilter
    return matchSearch && matchStatus && matchDate
  })

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    today: bookings.filter(b => b.date === new Date().toLocaleDateString('zh-HK')).length,
    revenue: bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.final_price || 0), 0)
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '20px' }}>管理後台</h1>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'transparent', color: '#fff', border: '1px solid #666', borderRadius: '6px', cursor: 'pointer' }}>登出</button>
        </div>
      </header>

      <div style={{ background: '#fff', borderBottom: '1px solid #eee', overflowX: 'auto' }}>
        <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '16px 20px', background: activeTab === t.id ? '#A68B6A' : 'transparent', color: activeTab === t.id ? '#fff' : '#666', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' }}>{t.name}</button>
          ))}
        </div>
      </div>

      <section style={{ padding: '24px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#3D3D3D' }}>{stats.today}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>今日預約</div>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b' }}>{stats.pending}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>待確認</div>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#22c55e' }}>{stats.confirmed}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>已確認</div>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#A68B6A' }}>${stats.revenue}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>總收入</div>
              </div>
            </div>
          )}

          {/* BOOKINGS */}
          {activeTab === 'bookings' && (
            <>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <input type="text" placeholder="搜尋姓名/電話" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1, minWidth: '150px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <option value="all">全部狀態</option>
                    <option value="pending">待確認</option>
                    <option value="confirmed">已確認</option>
                    <option value="completed">已完成</option>
                    <option value="cancelled">已取消</option>
                    <option value="no_show">未到</option>
                  </select>
                  <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead><tr style={{ background: '#FAF8F5' }}><th style={{ padding: '12px', textAlign: 'left' }}>客戶</th><th style={{ padding: '12px', textAlign: 'left' }}>服務</th><th style={{ padding: '12px', textAlign: 'left' }}>日期</th><th style={{ padding: '12px', textAlign: 'left' }}>狀態</th><th style={{ padding: '12px', textAlign: 'left' }}>操作</th></tr></thead>
                  <tbody>
                    {filteredBookings.slice(0, 20).map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                        <td style={{ padding: '12px' }}><div>{b.name}</div><div style={{ fontSize: '12px', color: '#999' }}>{b.phone}</div></td>
                        <td style={{ padding: '12px' }}>{b.service}</td>
                        <td style={{ padding: '12px' }}>{b.date} {b.time}</td>
                        <td style={{ padding: '12px' }}>
                          <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)} style={{ padding: '6px', borderRadius: '4px', fontSize: '12px', background: b.status === 'pending' ? '#fef3c7' : b.status === 'confirmed' ? '#dcfce7' : '#e5e7eb' }}>
                            <option value="pending">待確認</option>
                            <option value="confirmed">已確認</option>
                            <option value="completed">已完成</option>
                            <option value="cancelled">已取消</option>
                            <option value="no_show">未到</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => deleteBooking(b.id)} style={{ padding: '6px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>刪除</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* SERVICES */}
          {activeTab === 'services' && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h3>服務項目</h3><button onClick={addService} style={{ padding: '8px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ 新增</button></div>
              {services.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '12px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <input type="checkbox" checked={s.enabled} onChange={e => { const n = [...services]; n[i].enabled = e.target.checked; setServices(n) }} />
                  <input type="text" value={s.name} onChange={e => { const n = [...services]; n[i].name = e.target.value; setServices(n) }} style={{ flex: 1, minWidth: '100px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} placeholder="服務名稱" />
                  <input type="number" value={s.price} onChange={e => { const n = [...services]; n[i].price = parseInt(e.target.value); setServices(n) }} style={{ width: '80px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} placeholder="$" />
                  <input type="number" value={s.time} onChange={e => { const n = [...services]; n[i].time = parseInt(e.target.value); setServices(n) }} style={{ width: '60px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} placeholder="分" />
                  <span style={{ fontSize: '12px', color: '#999' }}>分</span>
                </div>
              ))}
              <button onClick={saveServices} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginTop: '10px' }}>{saving ? '保存中...' : '保存服務'}</button>
            </div>
          )}

          {/* TIME SLOTS */}
          {activeTab === 'time-slots' && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '20px' }}>⏰ 時段設定</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>營業時間</label><div style={{ display: 'flex', gap: '10px' }}><input type="time" value={settings.openTime} onChange={e => setSettings({...settings, openTime: e.target.value})} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} /><span>至</span><input type="time" value={settings.closeTime} onChange={e => setSettings({...settings, closeTime: e.target.value})} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} /></div></div>
                <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>每節時長 (分鐘)</label><input type="number" value={settings.slotDuration} onChange={e => setSettings({...settings, slotDuration: parseInt(e.target.value)})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>預約間隔 (分鐘)</label><input type="number" value={settings.bufferTime} onChange={e => setSettings({...settings, bufferTime: parseInt(e.target.value)})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>休息日</label><select value={settings.closedDay} onChange={e => setSettings({...settings, closedDay: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}><option value="0">星期日</option><option value="1">星期一</option><option value="2">星期二</option><option value="3">星期三</option><option value="4">星期四</option><option value="5">星期五</option><option value="6">星期六</option></select></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><input type="checkbox" checked={settings.enableOnlineBooking} onChange={e => setSettings({...settings, enableOnlineBooking: e.target.checked})} /><label style={{ fontWeight: 600 }}>啟用網上預約</label></div>
              </div>
              <button onClick={saveSettings} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginTop: '20px' }}>{saving ? '保存中...' : '保存設定'}</button>
            </div>
          )}

          {/* COUPONS */}
          {activeTab === 'coupons' && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h3>優惠碼</h3><button onClick={addCoupon} style={{ padding: '8px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ 新增</button></div>
              {coupons.map((c, i) => (
                <div key={c.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '12px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <input type="checkbox" checked={c.enabled} onChange={e => { const n = [...coupons]; n[i].enabled = e.target.checked; setCoupons(n) }} />
                  <input type="text" value={c.code} onChange={e => { const n = [...coupons]; n[i].code = e.target.value.toUpperCase(); setCoupons(n) }} style={{ width: '80px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', textTransform: 'uppercase' }} placeholder="CODE" />
                  <input type="text" value={c.name} onChange={e => { const n = [...coupons]; n[i].name = e.target.value; setCoupons(n) }} style={{ flex: 1, minWidth: '100px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} placeholder="優惠名稱" />
                  <input type="number" value={c.discount} onChange={e => { const n = [...coupons]; n[i].discount = parseInt(e.target.value); setCoupons(n) }} style={{ width: '60px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                  <select value={c.type} onChange={e => { const n = [...coupons]; n[i].type = e.target.value; setCoupons(n) }} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}><option value="percent">%</option><option value="fixed">$</option></select>
                </div>
              ))}
              <button onClick={saveCoupons} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginTop: '10px' }}>{saving ? '保存中...' : '保存優惠碼'}</button>
            </div>
          )}

          {/* CUSTOMERS */}
          {activeTab === 'customers' && (
            <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead><tr style={{ background: '#FAF8F5' }}><th style={{ padding: '12px', textAlign: 'left' }}>姓名</th><th style={{ padding: '12px', textAlign: 'left' }}>電話</th><th style={{ padding: '12px', textAlign: 'left' }}>電郵</th><th style={{ padding: '12px', textAlign: 'left' }}>積分</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ padding: '12px' }}>{u.name}</td>
                      <td style={{ padding: '12px' }}>{u.phone}</td>
                      <td style={{ padding: '12px' }}>{u.email}</td>
                      <td style={{ padding: '12px' }}>{u.points || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '20px' }}>⚙️ 店鋪設定</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>店鋪名稱</label><input type="text" value={settings.shopName} onChange={e => setSettings({...settings, shopName: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>電話</label><input type="text" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>地址</label><input type="text" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>預約須知</label><textarea value={settings.bookingNotice} onChange={e => setSettings({...settings, bookingNotice: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', minHeight: '80px' }} /></div>
                <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>取消政策</label><textarea value={settings.cancelPolicy} onChange={e => setSettings({...settings, cancelPolicy: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', minHeight: '80px' }} /></div>
              </div>
              <button onClick={saveSettings} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginTop: '20px' }}>{saving ? '保存中...' : '保存設定'}</button>
            </div>
          )}

        </div>
      </section>
    </>
  )
}
