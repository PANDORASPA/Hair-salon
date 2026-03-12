'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

// Import Tab Components (Stage 2)
import DashboardTab from '../components/admin/DashboardTab'
import AnalyticsTab from '../components/admin/AnalyticsTab'
import ProductsTab from '../components/admin/ProductsTab'
import ServicesTab from '../components/admin/ServicesTab'
import CouponsTab from '../components/admin/CouponsTab'
import CustomersTab from '../components/admin/CustomersTab'
import TicketsTab from '../components/admin/TicketsTab'
import PackagesTab from '../components/admin/PackagesTab'

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
  const [searchTermOrder, setSearchTermOrder] = useState('')
  const [searchTermProduct, setSearchTermProduct] = useState('')
  const [searchTermTicket, setSearchTermTicket] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [selectedStaffId, setSelectedStaffId] = useState(null)
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

  useEffect(() => {
    if (staff.length > 0 && !selectedStaffId) {
      setSelectedStaffId(staff[0].id)
    }
  }, [staff])

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
    if (sp.data) setServicePackages(sp.data.length > 0 ? sp.data : [{ id: 1, name: '剪髮+護理', services: [1,4], price: 580, orig: 660, emoji: '💆', description: '剪髮連護理套餐', enabled: true }])
    if (p.data) setProducts(p.data.length > 0 ? p.data : [{ id: 1, name: 'DS100護髮精華素', category: '護理', price: 680, orig: 880, description: '深層修復受損髮質', emoji: '💆', enabled: true }])
    if (t.data) setTickets(t.data.length > 0 ? t.data : [{ id: 1, name: 'Basic套票', price: 680, orig: 860, times: 2, features: '任何服務適用', emoji: '🎁', enabled: true }])
    if (c.data) setCoupons(c.data)
    if (u.data) setUsers(u.data)
    if (st.data) setStaff(st.data.length > 0 ? st.data : [{ id: 1, name: '髮型師A', role: '髮型師', phone: '', enabled: true, schedule: {}, services: [], daysOff: [] }])
    setLoading(false)
  }

  const handleLogin = (e) => { e.preventDefault(); if (password === ADMIN_PASSWORD) { localStorage.setItem('viva_admin_auth', 'true'); setIsAuthenticated(true); fetchData() } }
  const handleLogout = () => { localStorage.removeItem('viva_admin_auth'); setIsAuthenticated(false); router.push('/') }
  const updateStatus = async (id, status) => { await supabase.from('bookings').update({ status }).eq('id', id); setBookings(bookings.map(b => b.id === id ? { ...b, status } : b)) }
  const deleteBooking = async (id) => { if (confirm('確定刪除？')) { await supabase.from('bookings').delete().eq('id', id); setBookings(bookings.filter(b => b.id !== id)) } }
  
  const updateOrderStatus = async (id, status) => { await supabase.from('orders').update({ status }).eq('id', id); setOrders(orders.map(o => o.id === id ? { ...o, status } : o)) }
  const deleteOrder = async (id) => { if (confirm('確定刪除？')) { await supabase.from('orders').delete().eq('id', id); setOrders(orders.filter(o => o.id !== id)) } }

  const saveStaff = async () => {
    setSaving(true)
    for (const s of staff) await supabase.from('staff').upsert(s)
    alert('已保存')
    setSaving(false)
  }

  const addStaff = () => {
    const newId = Math.max(...staff.map(s => s.id), 0) + 1
    const newStaff = { id: newId, name: '新員工', role: '髮型師', phone: '', enabled: true, schedule: {}, services: [], daysOff: [] }
    setStaff([...staff, newStaff])
    setSelectedStaffId(newId)
  }

  const deleteStaff = async (id) => {
    if (!confirm('確定刪除此員工？')) return
    setSaving(true)
    await supabase.from('staff').delete().eq('id', id)
    setStaff(staff.filter(s => s.id !== id))
    if (selectedStaffId === id) {
      setSelectedStaffId(staff.length > 1 ? staff.find(s => s.id !== id)?.id : null)
    }
    setSaving(false)
  }

  const updateStaffField = (id, field, value) => {
    setStaff(staff.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const toggleStaffService = (staffId, serviceId) => {
    setStaff(staff.map(s => {
      if (s.id === staffId) {
        const svcs = s.services || []
        const hasService = svcs.includes(serviceId)
        return { ...s, services: hasService ? svcs.filter(id => id !== serviceId) : [...svcs, serviceId] }
      }
      return s
    }))
  }

  const toggleDailyOff = (staffId, dayKey) => {
    setStaff(staff.map(s => {
      if (s.id === staffId) {
        const daysOff = s.daysOff || []
        const has = daysOff.includes(dayKey)
        return { ...s, daysOff: has ? daysOff.filter(d => d !== dayKey) : [...daysOff, dayKey] }
      }
      return s
    }))
  }

  const updateStaffSchedule = (staffId, day, field, value) => {
    setStaff(staff.map(s => {
      if (s.id === staffId) {
        const schedule = s.schedule || {}
        return { ...s, schedule: { ...schedule, [day]: { ...schedule[day], [field]: value } } }
      }
      return s
    }))
  }

  const saveServices = async () => {
    setSaving(true)
    for (const s of services) await supabase.from('services').upsert(s)
    alert('已保存')
    setSaving(false)
  }

  const addService = () => {
    const newId = Math.max(...services.map(s => s.id), 0) + 1
    setServices([...services, { id: newId, name: '新服務', price: 0, time: 60, emoji: '✂️', category: '', description: '', enabled: true }])
  }

  const saveProducts = async () => {
    setSaving(true)
    try {
      for (const p of products) {
        const { id, name, category, description, price, orig, emoji, enabled } = p
        await supabase.from('products').upsert({ id, name, category, description, price, orig, emoji, enabled })
      }
      alert('已保存')
    } catch (err) {
      console.error(err)
      alert('保存失敗: ' + err.message)
    }
    setSaving(false)
  }

  const addProduct = () => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1
    setProducts([...products, { id: newId, name: '新產品', category: '護理', price: 0, orig: 0, description: '', emoji: '💄', enabled: true }])
  }

  const saveTickets = async () => {
    setSaving(true)
    try {
      for (const t of tickets) {
        const { id, name, price, orig, times, features, emoji, enabled } = t
        await supabase.from('tickets').upsert({ id, name, price, orig, times, features, emoji, enabled })
      }
      alert('已保存')
    } catch (err) {
      console.error(err)
      alert('保存失敗: ' + err.message)
    }
    setSaving(false)
  }

  const addTicket = () => {
    const newId = Math.max(...tickets.map(t => t.id), 0) + 1
    setTickets([...tickets, { id: newId, name: '新套票', price: 0, orig: 0, times: 2, features: '', emoji: '🎁', enabled: true }])
  }

  const saveServicePackages = async () => {
    setSaving(true)
    for (const p of servicePackages) await supabase.from('service_packages').upsert(p)
    alert('已保存')
    setSaving(false)
  }

  const addServicePackage = () => {
    const newId = Math.max(...servicePackages.map(p => p.id), 0) + 1
    setServicePackages([...servicePackages, { id: newId, name: '新套餐', services: [], price: 0, orig: 0, emoji: '💎', description: '', enabled: true }])
  }

  const saveCoupons = async () => {
    setSaving(true)
    for (const c of coupons) await supabase.from('coupons').upsert(c)
    alert('已保存')
    setSaving(false)
  }

  const addCoupon = () => {
    const newId = Math.max(...coupons.map(c => c.id), 0) + 1
    setCoupons([...coupons, { id: newId, code: 'NEW', name: '新優惠', discount: 10, type: 'percent', min_spend: 0, enabled: true }])
  }

  const filteredBookings = bookings.filter(b => (!searchTerm || b.name?.includes(searchTerm) || b.phone?.includes(searchTerm)) && (statusFilter === 'all' || b.status === statusFilter))
  const filteredOrders = orders.filter(o => (!searchTermOrder || o.name?.includes(searchTermOrder) || o.phone?.includes(searchTermOrder) || o.id?.toString().includes(searchTermOrder)) && (orderStatusFilter === 'all' || o.status === orderStatusFilter))
  const filteredProducts = products.filter(p => !searchTermProduct || p.name?.includes(searchTermProduct))
  const filteredTickets = tickets.filter(t => !searchTermTicket || t.name?.includes(searchTermTicket))

  const today = new Date().toLocaleDateString('zh-HK')
  const todayObj = new Date()
  const thisMonth = todayObj.getMonth()
  const thisYear = todayObj.getFullYear()
  
  const stats = {
    todayBookings: bookings.filter(b => b.date === today).length,
    todayRevenue: bookings.filter(b => b.date === today).reduce((sum, b) => sum + (b.final_price || 0), 0),
    totalUsers: users.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    monthBookings: bookings.filter(b => {
      const [d, m, y] = b.date?.split('/') || []
      return parseInt(y) === thisYear && parseInt(m) === thisMonth + 1
    }).length,
    monthRevenue: bookings.filter(b => {
      const [d, m, y] = b.date?.split('/') || []
      return parseInt(y) === thisYear && parseInt(m) === thisMonth + 1
    }).reduce((sum, b) => sum + (b.final_price || 0), 0),
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    totalRevenue: bookings.reduce((sum, b) => sum + (b.final_price || 0), 0),
    avgBookingValue: bookings.length > 0 ? Math.round(bookings.reduce((sum, b) => sum + (b.final_price || 0), 0) / bookings.length) : 0,
  }

  const serviceStats = services.map(sv => ({
    ...sv,
    count: bookings.filter(b => b.service === sv.name).length,
    revenue: bookings.filter(b => b.service === sv.name).reduce((sum, b) => sum + (b.final_price || 0), 0)
  })).sort((a, b) => b.count - a.count)

  const staffStats = staff.map(s => ({ 
    ...s, 
    bookings: bookings.filter(b => b.staff_id === s.id).length, 
    revenue: bookings.filter(b => b.staff_id === s.id).reduce((sum, b) => sum + (b.final_price || 0), 0),
    completed: bookings.filter(b => b.staff_id === s.id && b.status === 'completed').length
  }))
  const selectedStaff = staff.find(s => s.id === selectedStaffId)

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
      
      {/* Tab Navigation with Groups - Stage 1 */}
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
        {activeTab === 'dashboard' && <DashboardTab stats={stats} bookings={bookings} orders={orders} />}

        {/* Analytics */}
        {activeTab === 'analytics' && <AnalyticsTab bookings={bookings} orders={orders} staff={staff} />}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                {['日', '一', '二', '三', '四', '五', '六'].map(d => <div key={d} style={{ textAlign: 'center', padding: '8px', background: '#f5f5f5', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>{d}</div>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                {(() => {
                  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay()
                  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
                  const todayD = new Date().getDate()
                  const currentMonth = new Date().getMonth()
                  const currentYear = new Date().getFullYear()
                  let cells = []
                  for (let i = 0; i < firstDay; i++) cells.push(<div key={'empty-' + i} style={{ minHeight: '50px' }}></div>)
                  for (let d = 1; d <= daysInMonth; d++) {
                    const dayBookings = bookings.filter(b => {
                      const [day, month, year] = b.date?.split('/') || []
                      return parseInt(day) === d && parseInt(month) === currentMonth + 1 && parseInt(year) === currentYear
                    })
                    cells.push(
                      <div key={d} style={{ minHeight: '50px', padding: '4px', background: d === todayD ? '#fef3c7' : dayBookings.length > 0 ? '#dcfce7' : '#fafafa', borderRadius: '4px', border: '1px solid #eee', cursor: 'pointer' }}
                        onClick={() => dayBookings.length > 0 && setSelectedBooking(dayBookings[0])}>
                        <div style={{ fontWeight: d === todayD ? 700 : 400, fontSize: '12px' }}>{d}</div>
                        {dayBookings.length > 0 && <div style={{ fontSize: '9px', color: '#666' }}>{dayBookings.length}預約</div>}
                      </div>
                    )
                  }
                  return cells
                })()}
              </div>
            </div>
            <div style={{ background: '#fff', padding: '10px', borderRadius: '10px', marginBottom: '10px', display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="搜尋" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}><option value="all">全部</option><option value="pending">待確認</option><option value="confirmed">已確認</option></select>
            </div>
            <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}><thead><tr style={{ background: '#FAF8F5' }}><th style={{ padding: '8px', textAlign: 'left' }}>日期</th><th style={{ padding: '8px', textAlign: 'left' }}>客戶</th><th style={{ padding: '8px', textAlign: 'left' }}>服務</th><th style={{ padding: '8px', textAlign: 'left' }}>髮型師</th><th style={{ padding: '8px', textAlign: 'left' }}>狀態</th></tr></thead>
              <tbody>{filteredBookings.slice(0, 30).map(b => <tr key={b.id} onClick={() => setSelectedBooking(b)} style={{ borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}><td style={{ padding: '8px' }}>{b.date}<div style={{ fontSize: '10px', color: '#999' }}>{b.time}</div></td><td style={{ padding: '8px' }}>{b.name}<div style={{ fontSize: '10px', color: '#999' }}>{b.phone}</div></td><td style={{ padding: '8px' }}>{b.service}</td><td style={{ padding: '8px' }}>{b.staff_name || '-'}</td><td style={{ padding: '8px' }}><span style={{ padding: '4px 8px', background: b.status === 'pending' ? '#fef3c7' : b.status === 'confirmed' ? '#dbeafe' : b.status === 'completed' ? '#dcfce7' : b.status === 'cancelled' ? '#fee2e2' : '#f3f4f6', borderRadius: '4px', fontSize: '10px' }}>{b.status === 'pending' ? '待確認' : b.status === 'confirmed' ? '已確認' : b.status === 'completed' ? '已完成' : b.status === 'cancelled' ? '已取消' : '未到'}</span></td></tr>)}</tbody></table>
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
                <div style={{ marginBottom: '8px' }}><strong>預約編號：</strong>{selectedBooking.booking_ref}</div>
                <div style={{ marginBottom: '8px' }}><strong>日期時間：</strong>{selectedBooking.date} {selectedBooking.time}</div>
                <div style={{ marginBottom: '8px' }}><strong>服務：</strong>{selectedBooking.service} (${selectedBooking.price})</div>
                <div style={{ marginBottom: '8px' }}><strong>髮型師：</strong>{selectedBooking.staff_name || '隨機安排'}</div>
                <div style={{ marginBottom: '8px' }}><strong>客戶：</strong>{selectedBooking.name}</div>
                <div style={{ marginBottom: '8px' }}><strong>電話：</strong>{selectedBooking.phone}</div>
                <div style={{ marginBottom: '8px' }}><strong>優惠：</strong>{selectedBooking.coupon || '無'}</div>
                <div style={{ marginBottom: '8px' }}><strong>實收：</strong>${selectedBooking.final_price}</div>
                <div><strong>狀態：</strong>
                  <select value={selectedBooking.status} onChange={async (e) => { await updateStatus(selectedBooking.id, e.target.value); setSelectedBooking({...selectedBooking, status: e.target.value}) }} style={{ marginLeft: '8px', padding: '4px' }}>
                    <option value="pending">待確認</option>
                    <option value="confirmed">已確認</option>
                    <option value="completed">已完成</option>
                    <option value="cancelled">已取消</option>
                    <option value="no_show">未到</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={async () => { if(confirm('確定刪除？')) { await deleteBooking(selectedBooking.id); setSelectedBooking(null) }}} style={{ flex: 1, padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>刪除預約</button>
                <button onClick={() => setSelectedBooking(null)} style={{ flex: 1, padding: '12px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>關閉</button>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ background: '#fff', padding: '10px', borderRadius: '10px', marginBottom: '10px', display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="搜尋訂單" value={searchTermOrder} onChange={e => setSearchTermOrder(e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
              <select value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}><option value="all">全部</option><option value="pending">待處理</option><option value="paid">已付款</option><option value="shipped">已發貨</option><option value="completed">已完成</option></select>
            </div>
            {orders.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#999', background: '#fff', borderRadius: '10px' }}>暫時沒有訂單</div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}><thead><tr style={{ background: '#FAF8F5' }}><th style={{ padding: '8px', textAlign: 'left' }}>訂單編號</th><th style={{ padding: '8px', textAlign: 'left' }}>客戶</th><th style={{ padding: '8px', textAlign: 'left' }}>產品</th><th style={{ padding: '8px', textAlign: 'left' }}>金額</th><th style={{ padding: '8px', textAlign: 'left' }}>狀態</th><th style={{ padding: '8px', textAlign: 'left' }}></th></tr></thead>
                <tbody>{filteredOrders.slice(0, 20).map(o => <tr key={o.id} style={{ borderBottom: '1px solid #f5f5f5' }}><td style={{ padding: '8px' }}>#{o.id}<div style={{ fontSize: '10px', color: '#999' }}>{o.created_at?.split('T')[0]}</div></td><td style={{ padding: '8px' }}>{o.name}<div style={{ fontSize: '10px', color: '#999' }}>{o.phone}</div></td><td style={{ padding: '8px', fontSize: '11px' }}>{o.product_name || '-'}</td><td style={{ padding: '8px', fontWeight: 600 }}>${o.total}</td><td style={{ padding: '8px' }}><select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)} style={{ padding: '4px', fontSize: '10px', background: o.status === 'pending' ? '#fef3c7' : o.status === 'paid' ? '#dbeafe' : o.status === 'shipped' ? '#f3e8ff' : '#dcfce7', borderRadius: '4px' }}><option value="pending">待處理</option><option value="paid">已付款</option><option value="shipped">已發貨</option><option value="completed">已完成</option></select></td><td style={{ padding: '8px' }}><button onClick={() => deleteOrder(o.id)} style={{ padding: '4px 6px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '10px' }}>刪</button></td></tr>)}</tbody></table>
              </div>
            )}
          </div>
        )}

        {/* Products - Using Component */}
        {activeTab === 'products' && <ProductsTab products={products} searchTermProduct={searchTermProduct} setSearchTermProduct={setSearchTermProduct} saveProducts={saveProducts} />}

        {/* Staff */}
        {activeTab === 'staff' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><h3>💇 員工設定</h3><button onClick={addStaff} style={{ padding: '8px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px' }}>+ 新增員工</button></div>
            {staff.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#999', background: '#fff', borderRadius: '10px' }}>尚未有員工資料</div>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '200px', flexShrink: 0 }}>
                  <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    {staff.map(s => (
                      <div key={s.id} onClick={() => setSelectedStaffId(s.id)} style={{ 
                        padding: '14px 12px', 
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        background: selectedStaffId === s.id ? '#FAF8F5' : '#fff',
                        borderLeft: selectedStaffId === s.id ? '4px solid #A68B6A' : '4px solid transparent'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: s.enabled ? '#A68B6A' : '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px', fontWeight: 600 }}>
                            {s.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600 }}>{s.name}</div>
                            <div style={{ fontSize: '11px', color: '#999' }}>{s.role}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {selectedStaff ? (
                    <div style={{ background: '#