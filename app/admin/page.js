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
  const [searchTermOrder, setSearchTermOrder] = useState('')
  const [searchTermProduct, setSearchTermProduct] = useState('')
  const [searchTermTicket, setSearchTermTicket] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [selectedStaffId, setSelectedStaffId] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const tabs = [
    { id: 'dashboard', name: '📊' },
    { id: 'analytics', name: '📈' },
    { id: 'bookings', name: '📅' },
    { id: 'orders', name: '🛒' },
    { id: 'products', name: '💄' },
    { id: 'tickets', name: '🎫' },
    { id: 'packages', name: '💎' },
    { id: 'staff', name: '💇' },
    { id: 'services', name: '✂️' },
    { id: 'coupons', name: '🏷️' },
    { id: 'customers', name: '👥' },
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
        await supabase.from('products').upsert({ 
          id, name, category, description, price, orig, emoji, enabled 
        })
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
        await supabase.from('tickets').upsert({ 
          id, name, price, orig, times, features, emoji, enabled 
        })
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
    // More stats
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

  // Service breakdown
  const serviceStats = services.map(sv => ({
    ...sv,
    count: bookings.filter(b => b.service === sv.name).length,
    revenue: bookings.filter(b => b.service === sv.name).reduce((sum, b) => sum + (b.final_price || 0), 0)
  })).sort((a, b) => b.count - a.count)

  // Customer stats
  const customerStats = {
    newCustomers: users.filter(u => {
      const userBookings = bookings.filter(b => b.phone === u.phone)
      return userBookings.length === 1
    }).length,
    returningCustomers: users.filter(u => {
      const userBookings = bookings.filter(b => b.phone === u.phone)
      return userBookings.length > 1
    }).length,
    topCustomers: bookings.reduce((acc, b) => {
      acc[b.phone] = (acc[b.phone] || 0) + 1
      return acc
    }, {})
  }

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
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', overflowX: 'auto' }}>
        <div style={{ display: 'flex' }}>{tabs.map(t => <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '12px 16px', background: activeTab === t.id ? '#A68B6A' : 'transparent', color: activeTab === t.id ? '#fff' : '#666', border: 'none', cursor: 'pointer', fontSize: '13px' }}>{t.name}</button>)}</div>
      </div>
      <div style={{ padding: '16px' }}>
        {activeTab === 'dashboard' && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}><div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}><div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.todayBookings}</div><div style={{ fontSize: '11px', color: '#666' }}>今日預約</div></div><div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}><div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>${stats.todayRevenue}</div><div style={{ fontSize: '11px', color: '#666' }}>今日收入</div></div><div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}><div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.totalUsers}</div><div style={{ fontSize: '11px', color: '#666' }}>會員</div></div><div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}><div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.pending}</div><div style={{ fontSize: '11px', color: '#666' }}>待確認</div></div></div>}

        {activeTab === 'analytics' && <div>
          <h3 style={{ marginBottom: '12px' }}>📈 數據分析</h3>
          
          {/* Overview Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.todayBookings}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>今日預約</div>
            </div>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>${stats.todayRevenue}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>今日收入</div>
            </div>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.monthBookings}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>本月預約</div>
            </div>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>${stats.monthRevenue}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>本月收入</div>
            </div>
          </div>

          {/* Overall Stats */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', marginBottom: '12px' }}>
            <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>📊 總覽</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div><div style={{ fontSize: '20px', fontWeight: 700 }}>{bookings.length}</div><div style={{ fontSize: '11px', color: '#666' }}>總預約</div></div>
              <div><div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>${stats.totalRevenue}</div><div style={{ fontSize: '11px', color: '#666' }}>總收入</div></div>
              <div><div style={{ fontSize: '20px', fontWeight: 700 }}>${stats.avgBookingValue}</div><div style={{ fontSize: '11px', color: '#666' }}>平均消費</div></div>
              <div><div style={{ fontSize: '20px', fontWeight: 700 }}>{stats.totalUsers}</div><div style={{ fontSize: '11px', color: '#666' }}>會員數</div></div>
            </div>
          </div>

          {/* Booking Status */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', marginBottom: '12px' }}>
            <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>📋 預約狀態</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 45%', padding: '12px', background: '#fef3c7', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>{stats.pending}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>待確認</div>
              </div>
              <div style={{ flex: '1 1 45%', padding: '12px', background: '#dbeafe', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#2563eb' }}>{stats.confirmedBookings}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>已確認</div>
              </div>
              <div style={{ flex: '1 1 45%', padding: '12px', background: '#dcfce7', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#16a34a' }}>{stats.completedBookings}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>已完成</div>
              </div>
              <div style={{ flex: '1 1 45%', padding: '12px', background: '#f3f4f6', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#6b7280' }}>{bookings.length - stats.completedBookings - stats.confirmedBookings - stats.pending}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>已取消</div>
              </div>
            </div>
          </div>

          {/* Service Performance */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', marginBottom: '12px' }}>
            <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>✂️ 服務排行</h4>
            {serviceStats.slice(0, 5).map((sv, i) => (
              <div key={sv.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', fontSize: '13px' }}>
                <span><span style={{ marginRight: '8px', color: '#A68B6A' }}>{i + 1}.</span>{sv.name}</span>
                <span style={{ color: '#666' }}>{sv.count} 次 / ${sv.revenue}</span>
              </div>
            ))}
          </div>

          {/* Staff Performance */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', marginBottom: '12px' }}>
            <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>💇 髮型師表現</h4>
            {staffStats.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '13px' }}>暫無數據</div>
            ) : (
              staffStats.map(s => (
                <div key={s.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>{s.name} ({s.role})</span>
                    <span style={{ color: '#22c55e', fontWeight: 600 }}>${s.revenue}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#666' }}>
                    <span>📅 {s.bookings} 預約</span>
                    <span>✅ {s.completed} 完成</span>
                    <span>💰 平均 ${s.bookings > 0 ? Math.round(s.revenue / s.bookings) : 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Customer Stats */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: '10px' }}>
            <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>👥 客戶分析</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '12px' }}>
              <div style={{ padding: '12px', background: '#dcfce7', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#16a34a' }}>{customerStats.newCustomers}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>新客戶</div>
              </div>
              <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#ca8a04' }}>{customerStats.returningCustomers}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>回頭客</div>
              </div>
            </div>
          </div>
        </div>}

        {activeTab === 'staff' && <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><h3>💇 員工設定</h3><button onClick={addStaff} style={{ padding: '8px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px' }}>+ 新增員工</button></div>
          
          {staff.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999', background: '#fff', borderRadius: '10px' }}>尚未有員工資料<br/><button onClick={addStaff} style={{ marginTop: '10px', padding: '8px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px' }}>+ 新增員工</button></div>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Left: Staff List */}
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
              
              {/* Right: Staff Detail */}
              <div style={{ flex: 1 }}>
                {selectedStaff ? (
                  <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    {/* Basic Info */}
                    <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        {/* Photo Preview */}
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: selectedStaff.photo_url ? `url(${selectedStaff.photo_url}) center/cover` : (selectedStaff.enabled ? '#A68B6A' : '#ccc'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '28px', fontWeight: 700, overflow: 'hidden', flexShrink: 0 }}>
                          {!selectedStaff.photo_url && (selectedStaff.name?.charAt(0) || '?')}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <input type="text" value={selectedStaff.name} onChange={e => updateStaffField(selectedStaff.id, 'name', e.target.value)} placeholder="姓名" style={{ fontSize: '18px', fontWeight: 600, padding: '8px 12px', border: '1px solid #eee', borderRadius: '8px', width: '120px' }} />
                            <select value={selectedStaff.role} onChange={e => updateStaffField(selectedStaff.id, 'role', e.target.value)} style={{ padding: '8px 12px', border: '1px solid #eee', borderRadius: '8px', fontSize: '14px' }}>
                              <option>髮型師</option>
                              <option>助理</option>
                              <option>經理</option>
                            </select>
                          </div>
                          <input type="text" value={selectedStaff.phone || ''} onChange={e => updateStaffField(selectedStaff.id, 'phone', e.target.value)} placeholder="電話 (可留空)" style={{ padding: '8px 12px', border: '1px solid #eee', borderRadius: '8px', fontSize: '14px', width: '180px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={selectedStaff.enabled} onChange={e => updateStaffField(selectedStaff.id, 'enabled', e.target.checked)} />
                            啟用
                          </label>
                          <button onClick={() => { if(confirm('確定刪除此員工？')) { deleteStaff(selectedStaff.id) }}} style={{ padding: '8px 14px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '6px', fontSize: '13px' }}>🗑️ 刪除</button>
                        </div>
                      </div>
                      
                      {/* Photo URL */}
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>相片 URL</label>
                        <input type="text" value={selectedStaff.photo_url || ''} onChange={e => updateStaffField(selectedStaff.id, 'photo_url', e.target.value)} placeholder="https://example.com/photo.jpg" style={{ width: '100%', padding: '10px', border: '1px solid #eee', borderRadius: '8px', fontSize: '13px' }} />
                      </div>
                      
                      {/* Bio */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>個人簡介</label>
                        <textarea value={selectedStaff.bio || ''} onChange={e => updateStaffField(selectedStaff.id, 'bio', e.target.value)} placeholder="簡單介紹呢位髮型師..." style={{ width: '100%', padding: '10px', border: '1px solid #eee', borderRadius: '8px', fontSize: '13px', minHeight: '80px', resize: 'vertical' }} />
                      </div>
                    </div>
                    </div>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px', fontWeight: 500 }}>可提供服務</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {services.map(sv => (
                          <button key={sv.id} onClick={() => toggleStaffService(selectedStaff.id, sv.id)} 
                            style={{ padding: '8px 16px', background: selectedStaff.services?.includes(sv.id) ? '#A68B6A' : '#fff', 
                            color: selectedStaff.services?.includes(sv.id) ? '#fff' : '#666', border: '1px solid #e5e5e5', 
                            borderRadius: '20px', fontSize: '13px', cursor: 'pointer' }}>
                            {sv.emoji} {sv.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: '20px' }}>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px', fontWeight: 500 }}>每週上班時間</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginBottom: '20px' }}>
                        {['日', '一', '二', '三', '四', '五', '六'].map((day, idx) => {
                          const dayKey = idx.toString()
                          const daySchedule = selectedStaff.schedule?.[dayKey]
                          const isOff = selectedStaff.daysOff?.includes(dayKey)
                          return (
                            <div key={idx} style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: 500 }}>{day}</div>
                              {isOff ? (
                                <div onClick={() => toggleDailyOff(selectedStaff.id, dayKey)} style={{ padding: '12px 4px', background: '#ef4444', color: '#fff', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>放假</div>
                              ) : daySchedule?.start ? (
                                <div onClick={() => toggleDailyOff(selectedStaff.id, dayKey)} style={{ padding: '12px 4px', background: '#22c55e', color: '#fff', borderRadius: '8px', fontSize: '11px', cursor: 'pointer' }}>
                                  {daySchedule.start}-{daySchedule.end}
                                </div>
                              ) : (
                                <div onClick={() => updateStaffSchedule(selectedStaff.id, dayKey, 'start', '09:00')} style={{ padding: '12px 4px', background: '#f5f5f5', color: '#999', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>休息</div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>編輯時間：</div>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {['0', '1', '2', '3', '4', '5', '6'].map(d => (
                            <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '12px', width: '16px' }}>{['日', '一', '二', '三', '四', '五', '六'][d]}</span>
                              <input type="time" value={selectedStaff.schedule?.[d]?.start || ''} onChange={e => updateStaffSchedule(selectedStaff.id, d, 'start', e.target.value)} style={{ width: '85px', padding: '6px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                              <span style={{ fontSize: '10px' }}>-</span>
                              <input type="time" value={selectedStaff.schedule?.[d]?.end || ''} onChange={e => updateStaffSchedule(selectedStaff.id, d, 'end', e.target.value)} style={{ width: '85px', padding: '6px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#999', background: '#fff', borderRadius: '12px' }}>請選擇左邊既員工進行編輯</div>
                )}
              </div>
            </div>
          )}
          {staff.length > 0 && <button onClick={saveStaff} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginTop: '12px' }}>{saving ? '保存中...' : '💾 保存所有員工'}</button>}
        </div>}

        {activeTab === 'bookings' && <div>
          {/* Calendar View */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ margin: 0 }}>📅 預約月曆</h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
              {['日', '一', '二', '三', '四', '五', '六'].map(d => <div key={d} style={{ textAlign: 'center', padding: '8px', background: '#f5f5f5', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>{d}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
              {(() => {
                const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay()
                const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
                const today = new Date().getDate()
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
                    <div key={d} style={{ minHeight: '50px', padding: '4px', background: d === today ? '#fef3c7' : dayBookings.length > 0 ? '#dcfce7' : '#fafafa', borderRadius: '4px', border: '1px solid #eee', cursor: 'pointer' }}
                      onClick={() => dayBookings.length > 0 && setSelectedBooking(dayBookings[0])}>
                      <div style={{ fontWeight: d === today ? 700 : 400, fontSize: '12px' }}>{d}</div>
                      {dayBookings.length > 0 && <div style={{ fontSize: '9px', color: '#666' }}>{dayBookings.length}預約</div>}
                    </div>
                  )
                }
                return cells
              })()}
            </div>
          </div>

          {/* List View */}
          <div style={{ background: '#fff', padding: '10px', borderRadius: '10px', marginBottom: '10px', display: 'flex', gap: '8px' }}>
            <input type="text" placeholder="搜尋" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}><option value="all">全部</option><option value="pending">待確認</option><option value="confirmed">已確認</option></select>
          </div>
          <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}><thead><tr style={{ background: '#FAF8F5' }}><th style={{ padding: '8px', textAlign: 'left' }}>日期</th><th style={{ padding: '8px', textAlign: 'left' }}>服務</th><th style={{ padding: '8px', textAlign: 'left' }}>髮型師</th><th style={{ padding: '8px', textAlign: 'left' }}>狀態</th></tr></thead>
            <tbody>{filteredBookings.slice(0, 30).map(b => <tr key={b.id} onClick={() => setSelectedBooking(b)} style={{ borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}><td style={{ padding: '8px' }}>{b.date}<div style={{ fontSize: '10px', color: '#999' }}>{b.time}</div></td><td style={{ padding: '8px' }}>{b.name}<div style={{ fontSize: '10px', color: '#999' }}>{b.phone}</div></td><td style={{ padding: '8px', fontSize: '>{b.service}</td><td style={{ padding: '8px' }}>{b.staff11px' }}_name || '-'}</td><td style={{ padding: '8px' }}><span style={{ padding: '4px 8px', background: b.status === 'pending' ? '#fef3c7' : b.status === 'confirmed' ? '#dbeafe' : b.status === 'completed' ? '#dcfce7' : b.status === 'cancelled' ? '#fee2e2' : '#f3f4f6', borderRadius: '4px', fontSize: '10px' }}>{b.status === 'pending' ? '待確認' : b.status === 'confirmed' ? '已確認' : b.status === 'completed' ? '已完成' : b.status === 'cancelled' ? '已取消' : '未到'}</span></td></tr>)}</tbody></table>
          </div>
        </div>}

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setSelectedBooking(null)}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '400px', width: '100%' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>預約詳情</h3>
                <button onClick={() => setSelectedBooking(null)} style={{ padding: '8px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ background: '#fafafa', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ marginBottom: '8px' }}><strong>預約編號：</strong>{selectedBooking.ref}</div>
                <div style={{ marginBottom: '8px' }}><strong>日期時間：</strong>{selectedBooking.date} {selectedBooking.time}</div>
                <div style={{ marginBottom: '8px' }}><strong>服務：</strong>{selectedBooking.service} (${selectedBooking.service_price})</div>
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

        {activeTab === 'orders' && <div>
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
        </div>}

        {activeTab === 'products' && <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><h3>💄 產品設定</h3><button onClick={addProduct} style={{ padding: '8px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px' }}>+ 新增產品</button></div>
          <div style={{ background: '#fff', padding: '10px', borderRadius: '10px', marginBottom: '10px' }}>
            <input type="text" placeholder="搜尋產品" value={searchTermProduct} onChange={e => setSearchTermProduct(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
          </div>
          {filteredProducts.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999', background: '#fff', borderRadius: '10px' }}>尚未有產品資料<br/><button onClick={addProduct} style={{ marginTop: '10px', padding: '8px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px' }}>+ 新增產品</button></div>
          ) : (
            filteredProducts.map((p, i) => (
              <div key={p.id} style={{ background: '#fff', borderRadius: '12px', marginBottom: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{p.emoji || '💄'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="text" value={p.name} onChange={e => { const n = [...products]; n[i].name = e.target.value; setProducts(n) }} placeholder="產品名稱" style={{ fontSize: '16px', fontWeight: 600, padding: '6px 8px', border: '1px solid #eee', borderRadius: '6px', width: '150px' }} />
                        <select value={p.category || ''} onChange={e => { const n = [...products]; n[i].category = e.target.value; setProducts(n) }} style={{ padding: '6px 8px', border: '1px solid #eee', borderRadius: '6px', fontSize: '13px' }}>
                          <option value="">分類</option>
                          <option value="護理">護理</option>
                          <option value="洗護">洗護</option>
                          <option value="造型">造型</option>
                        </select>
                      </div>
                      <input type="text" value={p.description || ''} onChange={e => { const n = [...products]; n[i].description = e.target.value; setProducts(n) }} placeholder="產品描述" style={{ marginTop: '6px', padding: '6px 8px', border: '1px solid #eee', borderRadius: '6px', fontSize: '13px', width: '100%' }} />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={p.enabled} onChange={e => { const n = [...products]; n[i].enabled = e.target.checked; setProducts(n) }} />
                      啟用
                    </label>
                  </div>
                </div>
                <div style={{ padding: '12px 16px', background: '#fafafa', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#666' }}>💰 價格</span>
                    <span style={{ fontSize: '14px', color: '#A68B6A', fontWeight: 600 }}>$</span>
                    <input type="number" value={p.price} onChange={e => { const n = [...products]; n[i].price = parseInt(e.target.value) || 0; setProducts(n) }} style={{ width: '70px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#666' }}>🏷️ 原價</span>
                    <span style={{ fontSize: '14px', color: '#999' }}>$</span>
                    <input type="number" value={p.orig || 0} onChange={e => { const n = [...products]; n[i].orig = parseInt(e.target.value) || 0; setProducts(n) }} style={{ width: '70px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#666' }}>🏷️ Emoji</span>
                    <input type="text" value={p.emoji || ''} onChange={e => { const n = [...products]; n[i].emoji = e.target.value; setProducts(n) }} placeholder="💄" style={{ width: '50px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', textAlign: 'center' }} />
                  </div>
                </div>
              </div>
            ))
          )}
          <button onClick={saveProducts} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600 }}>{saving ? '保存中...' : '💾 保存所有產品'}</button>
        </div>}

        {activeTab === 'tickets' && <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><h3>🎫 套票設定</h3><button onClick={addTicket} style={{ padding: '8px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px' }}>+ 新增套票</button></div>
          <div style={{ background: '#fff', padding: '10px', borderRadius: '10px', marginBottom: '10px' }}>
            <input type="text" placeholder="搜尋套票" value={searchTermTicket} onChange={e => setSearchTermTicket(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
          </div>
          {filteredTickets.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999', background: '#fff', borderRadius: '10px' }}>尚未有套票資料<br/><button onClick={addTicket} style={{ marginTop: '10px', padding: '8px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px' }}>+ 新增套票</button></div>
          ) : (
            filteredTickets.map((t, i) => (
              <div key={t.id} style={{ background: '#fff', borderRadius: '12px', marginBottom: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{t.emoji || '🎫'}</div>
                    <div style={{ flex: 1 }}>
                      <input type="text" value={t.name} onChange={e => { const n = [...tickets]; n[i].name = e.target.value; setTickets(n) }} placeholder="套票名稱" style={{ fontSize: '16px', fontWeight: 600, padding: '6px 8px', border: '1px solid #eee', borderRadius: '6px', width: '150px', marginBottom: '6px' }} />
                      <input type="text" value={t.features || ''} onChange={e => { const n = [...tickets]; n[i].features = e.target.value; setTickets(n) }} placeholder="套票內容 (用逗號分隔)" style={{ padding: '6px 8px', border: '1px solid #eee', borderRadius: '6px', fontSize: '13px', width: '100%' }} />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={t.enabled} onChange={e => { const n = [...tickets]; n[i].enabled = e.target.checked; setTickets(n) }} />
                      啟用
                    </label>
                  </div>
                </div>
                <div style={{ padding: '12px 16px', background: '#fafafa', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#666' }}>💰 價格</span>
                    <span style={{ fontSize: '14px', color: '#A68B6A', fontWeight: 600 }}>$</span>
                    <input type="number" value={t.price} onChange={e => { const n = [...tickets]; n[i].price = parseInt(e.target.value) || 0; setTickets(n) }} style={{ width: '70px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#666' }}>🏷️ 原價</span>
                    <span style={{ fontSize: '14px', color: '#999' }}>$</span>
                    <input type="number" value={t.orig || 0} onChange={e => { const n = [...tickets]; n[i].orig = parseInt(e.target.value) || 0; setTickets(n) }} style={{ width: '70px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#666' }}>次數</span>
                    <input type="number" value={t.times || 1} onChange={e => { const n = [...tickets]; n[i].times = parseInt(e.target.value) || 1; setTickets(n) }} style={{ width: '50px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#666' }}>🏷️ Emoji</span>
                    <input type="text" value={t.emoji || ''} onChange={e => { const n = [...tickets]; n[i].emoji = e.target.value; setTickets(n) }} placeholder="🎫" style={{ width: '50px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', textAlign: 'center' }} />
                  </div>
                </div>
              </div>
            ))
          )}
          <button onClick={saveTickets} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600 }}>{saving ? '保存中...' : '💾 保存所有套票'}</button>
        </div>}

        {activeTab === 'services' && <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><h3>✂️ 服務設定</h3><button onClick={addService} style={{ padding: '8px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px' }}>+ 新增服務</button></div>
          {services.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: '#999', background: '#fff', borderRadius: '10px' }}>尚未有服務資料<br/><button onClick={addService} style={{ marginTop: '10px', padding: '8px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px' }}>+ 新增服務</button></div>}
          {services.map((sv, i) => (
            <div key={sv.id} style={{ background: '#fff', borderRadius: '12px', marginBottom: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                    {sv.emoji || '✂️'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="text" value={sv.name} onChange={e => { const n = [...services]; n[i].name = e.target.value; setServices(n) }} placeholder="服務名稱" style={{ fontSize: '16px', fontWeight: 600, padding: '6px 8px', border: '1px solid #eee', borderRadius: '6px', width: '120px' }} />
                      <select value={sv.category || ''} onChange={e => { const n = [...services]; n[i].category = e.target.value; setServices(n) }} style={{ padding: '6px 8px', border: '1px solid #eee', borderRadius: '6px', fontSize: '13px' }}>
                        <option value="">分類</option>
                        <option value="剪髮">剪髮</option>
                        <option value="染髮">染髮</option>
                        <option value="燙髮">燙髮</option>
                        <option value="護髮">護髮</option>
                        <option value="头皮护理">头皮护理</option>
                      </select>
                    </div>
                    <input type="text" value={sv.description || ''} onChange={e => { const n = [...services]; n[i].description = e.target.value; setServices(n) }} placeholder="服務描述 (可留空)" style={{ marginTop: '6px', padding: '6px 8px', border: '1px solid #eee', borderRadius: '6px', fontSize: '13px', width: '100%' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={sv.enabled} onChange={e => { const n = [...services]; n[i].enabled = e.target.checked; setServices(n) }} />
                      啟用
                    </label>
                  </div>
                </div>
              </div>
              <div style={{ padding: '12px 16px', background: '#fafafa', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#666' }}>💰 價格</span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#A68B6A', fontWeight: 600 }}>$</span>
                    <input type="number" value={sv.price} onChange={e => { const n = [...services]; n[i].price = parseInt(e.target.value) || 0; setServices(n) }} style={{ width: '70px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#666' }}>⏱️ 時間</span>
                  <input type="number" value={sv.time || 60} onChange={e => { const n = [...services]; n[i].time = parseInt(e.target.value) || 60; setServices(n) }} style={{ width: '60px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
                  <span style={{ fontSize: '13px', color: '#666' }}>分鐘</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#666' }}>🏷️ Emoji</span>
                  <input type="text" value={sv.emoji || ''} onChange={e => { const n = [...services]; n[i].emoji = e.target.value; setServices(n) }} placeholder="✂️" style={{ width: '50px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', textAlign: 'center' }} />
                </div>
              </div>
            </div>
          ))}
          <button onClick={saveServices} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600 }}>{saving ? '保存中...' : '💾 保存所有服務'}</button>
        </div>}

        {activeTab === 'coupons' && <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><h3>🏷️ 優惠</h3><button onClick={addCoupon} style={{ padding: '6px 12px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px' }}>+ 新增</button></div>
          {coupons.map((c, i) => <div key={c.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px', background: '#fff', borderRadius: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <input type="checkbox" checked={c.enabled} onChange={e => { const n = [...coupons]; n[i].enabled = e.target.checked; setCoupons(n) }} />
            <input type="text" value={c.code} onChange={e => { const n = [...coupons]; n[i].code = e.target.value.toUpperCase(); setCoupons(n) }} placeholder="CODE" style={{ width: '70px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', textTransform: 'uppercase' }} />
            <input type="text" value={c.name} onChange={e => { const n = [...coupons]; n[i].name = e.target.value; setCoupons(n) }} placeholder="優惠名稱" style={{ flex: '1 1 100px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
            <select value={c.type || 'percent'} onChange={e => { const n = [...coupons]; n[i].type = e.target.value; setCoupons(n) }} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}>
              <option value="percent">% 折</option>
              <option value="fixed">減$</option>
            </select>
            <input type="number" value={c.discount} onChange={e => { const n = [...coupons]; n[i].discount = parseInt(e.target.value); setCoupons(n) }} placeholder="金額" style={{ width: '50px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
            <input type="number" value={c.min_spend || 0} onChange={e => { const n = [...coupons]; n[i].min_spend = parseInt(e.target.value); setCoupons(n) }} placeholder="最低消費" style={{ width: '70px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
          </div>)}
          <button onClick={saveCoupons} disabled={saving} style={{ width: '100%', padding: '12px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px' }}>{saving ? '保存中...' : '保存'}</button>
        </div>}

        {activeTab === 'customers' && <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}><thead><tr style={{ background: '#FAF8F5' }}><th style={{ padding: '10px', textAlign: 'left' }}>姓名</th><th style={{ padding: '10px', textAlign: 'left' }}>電話</th><th style={{ padding: '10px', textAlign: 'left' }}>電郵</th><th style={{ padding: '10px', textAlign: 'left' }}>積分</th></tr></thead><tbody>{users.map(u => <tr key={u.id} style={{ borderBottom: '1px solid #f5f5f5' }}><td style={{ padding: '10px' }}>{u.name}</td><td style={{ padding: '10px' }}>{u.phone}</td><td style={{ padding: '10px' }}>{u.email}</td><td style={{ padding: '10px' }}>{u.points || 0}</td></tr>)}</tbody></table>
        </div>}
      </div>
    </div>
  )
}