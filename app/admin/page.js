'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const ADMIN_PASSWORD = 'viva2026'

  const [bookings, setBookings] = useState([])
  const [orders, setOrders] = useState([])
  const [services, setServices] = useState([])
  const [servicePackages, setServicePackages] = useState([])
  const [products, setProducts] = useState([])
  const [tickets, setTickets] = useState([])
  const [staff, setStaff] = useState([])
  const [coupons, setCoupons] = useState([])
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)

  // Tab groups - Stage 1
  const tabGroups = [
    { name: '營運', tabs: [
      { id: 'dashboard', name: '📊 數據' },
      { id: 'analytics', name: '📈 分析' },
      { id: 'bookings', name: '📅 預約' },
    ]},
    { name: '訂單', tabs: [
      { id: 'orders', name: '🛒 訂單' },
      { id: 'products', name: '💄 產品' },
    ]},
    { name: '服務', tabs: [
      { id: 'staff', name: '💇 員工' },
      { id: 'services', name: '✂️ 服務' },
      { id: 'packages', name: '💎 套餐' },
    ]},
    { name: '推廣', tabs: [
      { id: 'tickets', name: '🎫 套票' },
      { id: 'coupons', name: '🏷️ 優惠' },
    ]},
    { name: '會員', tabs: [
      { id: 'customers', name: '👥 客戶' },
    ]},
  ]

  useEffect(() => {
    const auth = localStorage.getItem('viva_admin_auth')
    if (auth === 'true') { setIsAuthenticated(true); fetchData() } 
    else setLoading(false)
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [b, o, s, sp, p, t, c, u, st] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('services').select('*'),
      supabase.from('service_packages').select('*'),
      supabase.from('products').select('*'),
      supabase.from('tickets').select('*'),
      supabase.from('coupons').select('*'),
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('staff').select('*').order('id'),
    ])
    if (b.data) setBookings(b.data)
    if (o.data) setOrders(o.data)
    if (s.data) setServices(s.data)
    if (sp.data) setServicePackages(sp.data)
    if (p.data) setProducts(p.data)
    if (t.data) setTickets(t.data)
    if (c.data) setCoupons(c.data)
    if (u.data) setUsers(u.data)
    if (st.data) setStaff(st.data)
    setLoading(false)
  }

  const handleLogin = (e) => { e.preventDefault(); if (password === ADMIN_PASSWORD) { localStorage.setItem('viva_admin_auth', 'true'); setIsAuthenticated(true); fetchData() } }
  const handleLogout = () => { localStorage.removeItem('viva_admin_auth'); setIsAuthenticated(false); router.push('/') }

  const updateStatus = async (id, status) => { 
    await supabase.from('bookings').update({ status }).eq('id', id)
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b))
  }

  const saveProducts = async () => {
    setSaving(true)
    for (const p of products) await supabase.from('products').upsert(p)
    alert('已保存')
    setSaving(false)
  }

  const saveServices = async () => {
    setSaving(true)
    for (const s of services) await supabase.from('services').upsert(s)
    alert('已保存')
    setSaving(false)
  }

  const saveCoupons = async () => {
    setSaving(true)
    for (const c of coupons) await supabase.from('coupons').upsert(c)
    alert('已保存')
    setSaving(false)
  }

  const saveTickets = async () => {
    setSaving(true)
    for (const t of tickets) await supabase.from('tickets').upsert(t)
    alert('已保存')
    setSaving(false)
  }

  const saveServicePackages = async () => {
    setSaving(true)
    for (const p of servicePackages) await supabase.from('service_packages').upsert(p)
    alert('已保存')
    setSaving(false)
  }

  const saveStaff = async () => {
    setSaving(true)
    for (const s of staff) await supabase.from('staff').upsert(s)
    alert('已保存')
    setSaving(false)
  }

  const today = new Date().toLocaleDateString('zh-HK')
  const stats = {
    todayBookings: bookings.filter(b => b.date === today).length,
    todayRevenue: bookings.filter(b => b.date === today).reduce((sum, b) => sum + (b.final_price || 0), 0),
    totalUsers: users.length,
    pending: bookings.filter(b => b.status === 'pending').length,
  }

  const filteredBookings = bookings.filter(b => (!searchTerm || b.name?.includes(searchTerm) || b.phone?.includes(searchTerm)) && (statusFilter === 'all' || b.status === statusFilter))

  if (!isAuthenticated) return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <h1>管理<span style={{ color: '#A68B6A' }}>後台</span></h1>
      <div style={{ maxWidth: '300px', margin: '30px auto', background: '#fff', padding: '30px', borderRadius: '12px' }}>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="密碼" style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px' }} />
        <button onClick={handleLogin} style={{ width: '100%', padding: '12px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px' }}>登入</button>
      </div>
    </div>
  )

  return (
    <div>
      <header style={{ background: '#3D3D3D', color: '#fff', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '16px' }}>後台</span>
        <button onClick={handleLogout} style={{ padding: '6px 12px', background: 'transparent', color: '#fff', border: '1px solid #666', borderRadius: '6px' }}>登出</button>
      </header>
      
      {/* Tab Navigation with Groups */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', overflowX: 'auto', padding: '8px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {tabGroups.map(group => (
            <div key={group.name} style={{ display: 'flex', gap: '4px', paddingRight: '12px', borderRight: '1px solid #eee' }}>
              {group.tabs.map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setActiveTab(t.id)} 
                  style={{ 
                    padding: '10px 16px', 
                    background: activeTab === t.id ? '#A68B6A' : '#f5f5f5', 
                    color: activeTab === t.id ? '#fff' : '#666', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontSize: '13px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ padding: '16px' }}>
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.todayBookings}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>今日預約</div>
            </div>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>${stats.todayRevenue}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>今日收入</div>
            </div>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.totalUsers}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>會員</div>
            </div>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.pending}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>待確認</div>
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <div>
            <h3>📈 數據分析</h3>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div><div style={{ fontSize: '20px', fontWeight: 700 }}>{bookings.length}</div><div style={{ fontSize: '11px', color: '#666' }}>總預約</div></div>
                <div><div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>${bookings.reduce((s, b) => s + (b.final_price || 0), 0)}</div><div style={{ fontSize: '11px', color: '#666' }}>總收入</div></div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div>
            <div style={{ background: '#fff', padding: '10px', borderRadius: '10px', marginBottom: '10px', display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="搜尋" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}><option value="all">全部</option><option value="pending">待確認</option><option value="confirmed">已確認</option></select>
            </div>
            <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead><tr style={{ background: '#FAF8F5' }}><th style={{ padding: '8px', textAlign: 'left' }}>日期</th><th style={{ padding: '8px', textAlign: 'left' }}>客戶</th><th style={{ padding: '8px', textAlign: 'left' }}>服務</th><th style={{ padding: '8px', textAlign: 'left' }}>狀態</th></tr></thead>
                <tbody>
                  {filteredBookings.slice(0, 30).map(b => (
                    <tr key={b.id} onClick={() => setSelectedBooking(b)} style={{ borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}>
                      <td style={{ padding: '8px' }}>{b.date}<div style={{ fontSize: '10px', color: '#999' }}>{b.time}</div></td>
                      <td style={{ padding: '8px' }}>{b.name}<div style={{ fontSize: '10px', color: '#999' }}>{b.phone}</div></td>
                      <td style={{ padding: '8px' }}>{b.service}</td>
                      <td style={{ padding: '8px' }}><span style={{ padding: '4px 8px', background: b.status === 'pending' ? '#fef3c7' : b.status === 'confirmed' ? '#dbeafe' : '#dcfce7', borderRadius: '4px', fontSize: '10px' }}>{b.status === 'pending' ? '待確認' : b.status === 'confirmed' ? '已確認' : '已完成'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {selectedBooking && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setSelectedBooking(null)}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '400px', width: '100%' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>預約詳情</h3>
                <button onClick={() => setSelectedBooking(null)} style={{ padding: '8px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ background: '#fafafa', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ marginBottom: '8px' }}><strong>日期時間：</strong>{selectedBooking.date} {selectedBooking.time}</div>
                <div style={{ marginBottom: '8px' }}><strong>服務：</strong>{selectedBooking.service}</div>
                <div style={{ marginBottom: '8px' }}><strong>髮型師：</strong>{selectedBooking.staff_name || '-'}</div>
                <div style={{ marginBottom: '8px' }}><strong>客戶：</strong>{selectedBooking.name}</div>
                <div style={{ marginBottom: '8px' }}><strong>電話：</strong>{selectedBooking.phone}</div>
                <div><strong>狀態：</strong>
                  <select value={selectedBooking.status} onChange={async (e) => { await updateStatus(selectedBooking.id, e.target.value); setSelectedBooking({...selectedBooking, status: e.target.value}) }} style={{ marginLeft: '8px', padding: '4px' }}>
                    <option value="pending">待確認</option>
                    <option value="confirmed">已確認</option>
                    <option value="completed">已完成</option>
                    <option value="cancelled">已取消</option>
                  </select>
                </div>
              </div>
              <button onClick={() => setSelectedBooking(null)} style={{ width: '100%', padding: '12px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>關閉</button>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead><tr style={{ background: '#FAF8F5' }}><th style={{ padding: '8px', textAlign: 'left' }}>訂單</th><th style={{ padding: '8px', textAlign: 'left' }}>客戶</th><th style={{ padding: '8px', textAlign: 'left' }}>金額</th><th style={{ padding: '8px', textAlign: 'left' }}>狀態</th></tr></thead>
              <tbody>
                {orders.slice(0, 20).map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '8px' }}>#{o.id}</td>
                    <td style={{ padding: '8px' }}>{o.name}</td>
                    <td style={{ padding: '8px' }}>${o.total}</td>
                    <td style={{ padding: '8px' }}>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {products.map((p, i) => (
                <div key={p.id} style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #eee' }}>
                  <input value={p.name} onChange={(e) => { const n = [...products]; n[i].name = e.target.value; setProducts(n) }} placeholder="產品名稱" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '8px' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input value={p.price} onChange={(e) => { const n = [...products]; n[i].price = parseInt(e.target.value) || 0; setProducts(n) }} type="number" placeholder="價格" style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    <input value={p.emoji || ''} onChange={(e) => { const n = [...products]; n[i].emoji = e.target.value; setProducts(n) }} placeholder="Emoji" style={{ width: '50px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', textAlign: 'center' }} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={saveProducts} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginTop: '16px' }}>{saving ? '保存中...' : '💾 保存'}</button>
          </div>
        )}

        {/* Staff */}
        {activeTab === 'staff' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {staff.map((s, i) => (
                <div key={s.id} style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #eee' }}>
                  <input value={s.name} onChange={(e) => { const n = [...staff]; n[i].name = e.target.value; setStaff(n) }} placeholder="姓名" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '8px' }} />
                  <input value={s.role || ''} onChange={(e) => { const n = [...staff]; n[i].role = e.target.value; setStaff(n) }} placeholder="職位" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
              ))}
            </div>
            <button onClick={saveStaff} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginTop: '16px' }}>{saving ? '保存中...' : '💾 保存'}</button>
          </div>
        )}

        {/* Services */}
        {activeTab === 'services' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {services.map((sv, i) => (
                <div key={sv.id} style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #eee' }}>
                  <input value={sv.name} onChange={(e) => { const n = [...services]; n[i].name = e.target.value; setServices(n) }} placeholder="服務名稱" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '8px' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input value={sv.price} onChange={(e) => { const n = [...services]; n[i].price = parseInt(e.target.value) || 0; setServices(n) }} type="number" placeholder="價格" style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    <input value={sv.time || 60} onChange={(e) => { const n = [...services]; n[i].time = parseInt(e.target.value) || 60; setServices(n) }} type="number" placeholder="分鐘" style={{ width: '70px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={saveServices} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginTop: '16px' }}>{saving ? '保存中...' : '💾 保存'}</button>
          </div>
        )}

        {/* Packages */}
        {activeTab === 'packages' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {servicePackages.map((p, i) => (
                <div key={p.id} style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '2px solid #A68B6A' }}>
                  <input value={p.name} onChange={(e) => { const n = [...servicePackages]; n[i].name = e.target.value; setServicePackages(n) }} placeholder="套餐名稱" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '8px' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input value={p.price} onChange={(e) => { const n = [...servicePackages]; n[i].price = parseInt(e.target.value) || 0; setServicePackages(n) }} type="number" placeholder="套餐價" style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    <input value={p.orig || 0} onChange={(e) => { const n = [...servicePackages]; n[i].orig = parseInt(e.target.value) || 0; setServicePackages(n) }} type="number" placeholder="原價" style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={saveServicePackages} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginTop: '16px' }}>{saving ? '保存中...' : '💾 保存'}</button>
          </div>
        )}

        {/* Tickets */}
        {activeTab === 'tickets' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {tickets.map((t, i) => (
                <div key={t.id} style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #eee' }}>
                  <input value={t.name} onChange={(e) => { const n = [...tickets]; n[i].name = e.target.value; setTickets(n) }} placeholder="套票名稱" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '8px' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input value={t.price} onChange={(e) => { const n = [...tickets]; n[i].price = parseInt(e.target.value) || 0; setTickets(n) }} type="number" placeholder="價格" style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    <input value={t.times || 1} onChange={(e) => { const n = [...tickets]; n[i].times = parseInt(e.target.value) || 1; setTickets(n) }} type="number" placeholder="次數" style={{ width: '60px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={saveTickets} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginTop: '16px' }}>{saving ? '保存中...' : '💾 保存'}</button>
          </div>
        )}

        {/* Coupons */}
        {activeTab === 'coupons' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {coupons.map((c, i) => (
                <div key={c.id} style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #eee' }}>
                  <input value={c.code} onChange={(e) => { const n = [...coupons]; n[i].code = e.target.value.toUpperCase(); setCoupons(n) }} placeholder="優惠碼" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '8px', textTransform: 'uppercase' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input value={c.discount} onChange={(e) => { const n = [...coupons]; n[i].discount = parseInt(e.target.value) || 0; setCoupons(n) }} type="number" placeholder="折扣" style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    <select value={c.type || 'percent'} onChange={(e) => { const n = [...coupons]; n[i].type = e.target.value; setCoupons(n) }} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}>
                      <option value="percent">%</option>
                      <option value="fixed">$</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={saveCoupons} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginTop: '16px' }}>{saving ? '保存中...' : '💾 保存'}</button>
          </div>
        )}

        {/* Customers */}
        {activeTab === 'customers' && (
          <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead><tr style={{ background: '#FAF8F5' }}><th style={{ padding: '10px', textAlign: 'left' }}>姓名</th><th style={{ padding: '10px', textAlign: 'left' }}>電話</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '10px' }}>{u.name}</td>
                    <td style={{ padding: '10px' }}>{u.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
