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
  const [services, setServices] = useState([])
  const [staff, setStaff] = useState([])
  const [coupons, setCoupons] = useState([])
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [selectedStaff, setSelectedStaff] = useState(null)

  const tabs = [
    { id: 'dashboard', name: '📊' },
    { id: 'analytics', name: '📈' },
    { id: 'bookings', name: '📅' },
    { id: 'staff', name: '💇' },
    { id: 'services', name: '✂️' },
    { id: 'coupons', name: '🎫' },
    { id: 'customers', name: '👥' },
  ]

  useEffect(() => {
    const auth = localStorage.getItem('viva_admin_auth')
    if (auth === 'true') { setIsAuthenticated(true); fetchData() } 
    else setLoading(false)
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [b, s, c, u, st] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('services').select('*'),
      supabase.from('coupons').select('*'),
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('staff').select('*').order('id'),
    ])
    if (b.data) setBookings(b.data)
    if (s.data) setServices(s.data)
    if (c.data) setCoupons(c.data)
    if (u.data) setUsers(u.data)
    if (st.data) setStaff(st.data.length > 0 ? st.data : [{ id: 1, name: '髮型師A', role: '髮型師', phone: '', enabled: true, schedule: {}, services: [] }])
    setLoading(false)
  }

  const handleLogin = (e) => { e.preventDefault(); if (password === ADMIN_PASSWORD) { localStorage.setItem('viva_admin_auth', 'true'); setIsAuthenticated(true); fetchData() } }
  const handleLogout = () => { localStorage.removeItem('viva_admin_auth'); setIsAuthenticated(false); router.push('/') }
  const updateStatus = async (id, status) => { await supabase.from('bookings').update({ status }).eq('id', id); setBookings(bookings.map(b => b.id === id ? { ...b, status } : b)) }
  const deleteBooking = async (id) => { if (confirm('確定刪除？')) { await supabase.from('bookings').delete().eq('id', id); setBookings(bookings.filter(b => b.id !== id)) } }

  const saveStaff = async () => {
    setSaving(true)
    for (const s of staff) await supabase.from('staff').upsert(s)
    alert('已保存')
    setSaving(false)
  }

  const addStaff = () => {
    const newId = Math.max(...staff.map(s => s.id), 0) + 1
    setStaff([...staff, { id: newId, name: '新員工', role: '髮型師', phone: '', enabled: true, schedule: {}, services: [], daysOff: [] }])
  }

  const deleteStaff = async (id) => {
    if (!confirm('確定刪除此員工？')) return
    setSaving(true)
    await supabase.from('staff').delete().eq('id', id)
    setStaff(staff.filter(s => s.id !== id))
    setSaving(false)
  }

  const updateStaffField = (id, field, value) => {
    setStaff(staff.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const toggleStaffService = (staffId, serviceId) => {
    setStaff(staff.map(s => {
      if (s.id === staffId) {
        const services = s.services || []
        const hasService = services.includes(serviceId)
        return { ...s, services: hasService ? services.filter(id => id !== serviceId) : [...services, serviceId] }
      }
      return s
    }))
  }

  // Calendar helpers
  const getCalendarDays = () => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []
    // Add empty slots for days before first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }
    // Add all days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const formatDateKey = (date) => {
    if (!date) return null
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const getMonthName = () => {
    return calendarMonth.toLocaleDateString('zh-HK', { year: 'numeric', month: 'long' })
  }

  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
  }

  const updateDailySchedule = (staffId, dateKey, field, value) => {
    setStaff(staff.map(s => {
      if (s.id === staffId) {
        const schedule = s.schedule || {}
        return { ...s, schedule: { ...schedule, [dateKey]: { ...schedule[dateKey], [field]: value } } }
      }
      return s
    }))
  }

  const toggleDailyOff = (staffId, dateKey) => {
    setStaff(staff.map(s => {
      if (s.id === staffId) {
        const daysOff = s.daysOff || []
        const has = daysOff.includes(dateKey)
        return { ...s, daysOff: has ? daysOff.filter(d => d !== dateKey) : [...daysOff, dateKey] }
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
    setServices([...services, { id: newId, name: '新服務', price: 0, time: 60, enabled: true }])
  }

  const saveCoupons = async () => {
    setSaving(true)
    for (const c of coupons) await supabase.from('coupons').upsert(c)
    alert('已保存')
    setSaving(false)
  }

  const addCoupon = () => {
    const newId = Math.max(...coupons.map(c => c.id), 0) + 1
    setCoupons([...coupons, { id: newId, code: 'NEW', name: '新優惠', discount: 10, type: 'percent', enabled: true }])
  }

  const filteredBookings = bookings.filter(b => (!searchTerm || b.name?.includes(searchTerm) || b.phone?.includes(searchTerm)) && (statusFilter === 'all' || b.status === statusFilter))

  const today = new Date().toLocaleDateString('zh-HK')
  const stats = {
    todayBookings: bookings.filter(b => b.date === today).length,
    todayRevenue: bookings.filter(b => b.date === today).reduce((sum, b) => sum + (b.final_price || 0), 0),
    totalUsers: users.length,
    pending: bookings.filter(b => b.status === 'pending').length,
  }

  const staffStats = staff.map(s => ({ ...s, bookings: bookings.filter(b => b.staff_id === s.id).length, revenue: bookings.filter(b => b.staff_id === s.id).reduce((sum, b) => sum + (b.final_price || 0), 0) }))
  const days = ['0', '1', '2', '3', '4', '5', '6']
  const dayNames = ['日', '一', '二', '三', '四', '五', '六']

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
          <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', marginBottom: '10px' }}>
            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>髮型師表現</h4>
            {staffStats.map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', fontSize: '13px' }}>
                <span>{s.name} ({s.role})</span>
                <span>{s.bookings} 預約 / ${s.revenue}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '10px' }}>
            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>本月預約趨勢</h4>
            <div style={{ fontSize: '12px', color: '#666' }}>總預約: {bookings.length}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>已完成: {bookings.filter(b => b.status === 'completed').length}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>已確認: {bookings.filter(b => b.status === 'confirmed').length}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>待確認: {bookings.filter(b => b.status === 'pending').length}</div>
          </div>
        </div>}

        {activeTab === 'staff' && <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><h3>💇 員工設定</h3><button onClick={addStaff} style={{ padding: '6px 12px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px' }}>+ 新增</button></div>
          {staff.map(s => <div key={s.id} style={{ background: '#fff', padding: '12px', borderRadius: '10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
              <input type="checkbox" checked={s.enabled} onChange={e => updateStaffField(s.id, 'enabled', e.target.checked)} />
              <input type="text" value={s.name} onChange={e => updateStaffField(s.id, 'name', e.target.value)} placeholder="姓名" style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
              <select value={s.role} onChange={e => updateStaffField(s.id, 'role', e.target.value)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}><option>髮型師</option><option>助理</option><option>經理</option></select>
              <input type="text" value={s.phone || ''} onChange={e => updateStaffField(s.id, 'phone', e.target.value)} placeholder="電話" style={{ width: '100px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
              <button onClick={() => deleteStaff(s.id)} style={{ padding: '6px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px' }}>刪除</button>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>可提供服務：</div>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>{services.map(sv => <button key={sv.id} onClick={() => toggleStaffService(s.id, sv.id)} style={{ padding: '4px 8px', background: s.services?.includes(sv.id) ? '#A68B6A' : '#f5f5f5', color: s.services?.includes(sv.id) ? '#fff' : '#666', border: 'none', borderRadius: '4px', fontSize: '11px' }}>{sv.name}</button>)}</div>
            </div>
            
            {/* Calendar Schedule */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>上班時間：</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={prevMonth} style={{ padding: '4px 8px', background: '#f5f5f5', border: 'none', borderRadius: '4px' }}>◀</button>
                  <span style={{ fontSize: '12px', minWidth: '80px', textAlign: 'center' }}>{getMonthName()}</span>
                  <button onClick={nextMonth} style={{ padding: '4px 8px', background: '#f5f5f5', border: 'none', borderRadius: '4px' }}>▶</button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', fontSize: '10px', textAlign: 'center', marginBottom: '4px' }}>
                {['日', '一', '二', '三', '四', '五', '六'].map(d => <div key={d} style={{ padding: '4px', background: '#f5f5f5', borderRadius: '4px' }}>{d}</div>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                {getCalendarDays().map((date, idx) => {
                  if (!date) return <div key={idx} style={{ minHeight: '60px' }}></div>
                  const dateKey = formatDateKey(date)
                  const daySchedule = s.schedule?.[dateKey]
                  const isOff = s.daysOff?.includes(dateKey)
                  const isToday = formatDateKey(new Date()) === dateKey
                  return (
                    <div key={idx} onClick={() => setSelectedStaff(selectedStaff === s.id && dateKey === selectedStaff?.dateKey ? null : { staffId: s.id, dateKey })}
                      style={{ 
                        minHeight: '60px', 
                        padding: '4px', 
                        background: isOff ? '#ef4444' : daySchedule?.start ? '#dcfce7' : '#fafafa', 
                        borderRadius: '4px', 
                        border: isToday ? '2px solid #A68B6A' : '1px solid #eee',
                        cursor: 'pointer',
                        fontSize: '10px'
                      }}>
                      <div style={{ fontWeight: isToday ? 700 : 400 }}>{date.getDate()}</div>
                      {isOff ? (
                        <div style={{ color: '#fff', fontSize: '9px' }}>放假</div>
                      ) : daySchedule?.start ? (
                        <div style={{ color: '#166534', fontSize: '9px' }}>{daySchedule.start}-{daySchedule.end}</div>
                      ) : (
                        <div style={{ color: '#999', fontSize: '9px' }}>休息</div>
                      )}
                    </div>
                  )
                })}
              </div>
              
              {/* Day editor popup */}
              {selectedStaff?.staffId === s.id && (
                <div style={{ marginTop: '8px', padding: '10px', background: '#f5f5f5', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', marginBottom: '6px' }}>設定 {selectedStaff.dateKey}：</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label style={{ fontSize: '11px' }}>開始：</label>
                    <input type="time" value={s.schedule?.[selectedStaff.dateKey]?.start || ''} 
                      onChange={e => updateDailySchedule(s.id, selectedStaff.dateKey, 'start', e.target.value)}
                      style={{ padding: '4px', fontSize: '11px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    <label style={{ fontSize: '11px' }}>收工：</label>
                    <input type="time" value={s.schedule?.[selectedStaff.dateKey]?.end || ''} 
                      onChange={e => updateDailySchedule(s.id, selectedStaff.dateKey, 'end', e.target.value)}
                      style={{ padding: '4px', fontSize: '11px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    <button onClick={() => toggleDailyOff(s.id, selectedStaff.dateKey)}
                      style={{ padding: '4px 8px', background: s.daysOff?.includes(selectedStaff.dateKey) ? '#ef4444' : '#666', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '10px' }}>
                      {s.daysOff?.includes(selectedStaff.dateKey) ? '取消放假' : '放假'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>)}
          <button onClick={saveStaff} disabled={saving} style={{ width: '100%', padding: '12px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px' }}>{saving ? '保存中...' : '保存員工'}</button>
        </div>}

        {activeTab === 'bookings' && <div>
          <div style={{ background: '#fff', padding: '10px', borderRadius: '10px', marginBottom: '10px', display: 'flex', gap: '8px' }}>
            <input type="text" placeholder="搜尋" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}><option value="all">全部</option><option value="pending">待確認</option><option value="confirmed">已確認</option></select>
          </div>
          <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}><thead><tr style={{ background: '#FAF8F5' }}><th style={{ padding: '8px', textAlign: 'left' }}>客戶</th><th style={{ padding: '8px', textAlign: 'left' }}>服務</th><th style={{ padding: '8px', textAlign: 'left' }}>髮型師</th><th style={{ padding: '8px', textAlign: 'left' }}>狀態</th><th style={{ padding: '8px', textAlign: 'left' }}></th></tr></thead>
            <tbody>{filteredBookings.slice(0, 20).map(b => <tr key={b.id} style={{ borderBottom: '1px solid #f5f5f5' }}><td style={{ padding: '8px' }}>{b.name}<div style={{ fontSize: '10px', color: '#999' }}>{b.phone}</div></td><td style={{ padding: '8px', fontSize: '11px' }}>{b.service}</td><td style={{ padding: '8px' }}>{b.staff_name || '-'}</td><td style={{ padding: '8px' }}><select value={b.status} onChange={e => updateStatus(b.id, e.target.value)} style={{ padding: '4px', fontSize: '10px', background: b.status === 'pending' ? '#fef3c7' : '#dcfce7', borderRadius: '4px' }}><option value="pending">待確認</option><option value="confirmed">已確認</option><option value="completed">已完成</option></select></td><td style={{ padding: '8px' }}><button onClick={() => deleteBooking(b.id)} style={{ padding: '4px 6px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '10px' }}>刪</button></td></tr>)}</tbody></table>
          </div>
        </div>}

        {activeTab === 'services' && <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><h3>✂️ 服務</h3><button onClick={addService} style={{ padding: '6px 12px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px' }}>+ 新增</button></div>
          {services.map((s, i) => <div key={s.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px', background: '#fff', borderRadius: '8px', marginBottom: '8px' }}>
            <input type="checkbox" checked={s.enabled} onChange={e => { const n = [...services]; n[i].enabled = e.target.checked; setServices(n) }} />
            <input type="text" value={s.name} onChange={e => { const n = [...services]; n[i].name = e.target.value; setServices(n) }} style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
            <input type="number" value={s.price} onChange={e => { const n = [...services]; n[i].price = parseInt(e.target.value); setServices(n) }} style={{ width: '60px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
          </div>)}
          <button onClick={saveServices} disabled={saving} style={{ width: '100%', padding: '12px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px' }}>{saving ? '保存中...' : '保存'}</button>
        </div>}

        {activeTab === 'coupons' && <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><h3>🎫 優惠</h3><button onClick={addCoupon} style={{ padding: '6px 12px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px' }}>+ 新增</button></div>
          {coupons.map((c, i) => <div key={c.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px', background: '#fff', borderRadius: '8px', marginBottom: '8px' }}>
            <input type="checkbox" checked={c.enabled} onChange={e => { const n = [...coupons]; n[i].enabled = e.target.checked; setCoupons(n) }} />
            <input type="text" value={c.code} onChange={e => { const n = [...coupons]; n[i].code = e.target.value.toUpperCase(); setCoupons(n) }} style={{ width: '70px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', textTransform: 'uppercase' }} />
            <input type="text" value={c.name} onChange={e => { const n = [...coupons]; n[i].name = e.target.value; setCoupons(n) }} style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
            <input type="number" value={c.discount} onChange={e => { const n = [...coupons]; n[i].discount = parseInt(e.target.value); setCoupons(n) }} style={{ width: '50px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
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
