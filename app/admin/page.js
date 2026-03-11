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

  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [staff, setStaff] = useState([])
  const [coupons, setCoupons] = useState([])
  const [users, setUsers] = useState([])
  const [settings, setSettings] = useState({ shopName: 'VIVA HAIR', phone: '1234 5678', openTime: '11:00', closeTime: '20:00', closedDay: '1', slotDuration: 60, enableOnlineBooking: true })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const tabs = [
    { id: 'dashboard', name: '📊 Dashboard' },
    { id: 'analytics', name: '📈 數據' },
    { id: 'bookings', name: '📅 預約' },
    { id: 'staff', name: '💇 員工' },
    { id: 'schedule', name: '📅 排班' },
    { id: 'services', name: '✂️ 服務' },
    { id: 'coupons', name: '🎫 優惠' },
    { id: 'customers', name: '👥 客戶' },
  ]

  useEffect(() => {
    const auth = localStorage.getItem('viva_admin_auth')
    if (auth === 'true') { setIsAuthenticated(true); fetchData() } else setLoading(false)
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [b, s, c, u, st, set] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('services').select('*').order('sort_order'),
      supabase.from('coupons').select('*'),
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('staff').select('*').order('id'),
      supabase.from('settings').select('value').eq('key', 'shop_settings').single()
    ])
    if (b.data) setBookings(b.data)
    if (s.data) setServices(s.data)
    if (c.data) setCoupons(c.data)
    if (u.data) setUsers(u.data)
    if (st.data) setStaff(st.data.length > 0 ? st.data : [{ id: 1, name: '髮型師A', role: '髮型師', phone: '', enabled: true, schedule: {} }])
    if (set.data?.value) setSettings({ ...settings, ...JSON.parse(set.data.value) })
    setLoading(false)
  }

  const handleLogin = (e) => { e.preventDefault(); if (password === ADMIN_PASSWORD) { localStorage.setItem('viva_admin_auth', 'true'); setIsAuthenticated(true); fetchData() } else setError('密碼錯誤') }
  const handleLogout = () => { localStorage.removeItem('viva_admin_auth'); setIsAuthenticated(false); router.push('/') }
  const updateStatus = async (id, status) => { await supabase.from('bookings').update({ status }).eq('id', id); setBookings(bookings.map(b => b.id === id ? { ...b, status } : b)) }
  const deleteBooking = async (id) => { if (confirm('確定刪除？')) { await supabase.from('bookings').delete().eq('id', id); setBookings(bookings.filter(b => b.id !== id)) } }

  const saveStaff = async () => { setSaving(true); for (const s of staff) await supabase.from('staff').upsert(s); alert('已保存'); setSaving(false) }
  const addStaff = () => { const newId = Math.max(...staff.map(s => s.id), 0) + 1; setStaff([...staff, { id: newId, name: '新員工', role: '髮型師', phone: '', enabled: true, schedule: {} }]) }
  const updateStaffSchedule = (staffId, day, field, value) => { setStaff(staff.map(s => s.id === staffId ? { ...s, schedule: { ...s.schedule, [day]: { ...s.schedule?.[day], [field]: value } } } : s)) }

  const saveServices = async () => { setSaving(true); for (const s of services) await supabase.from('services').upsert(s); alert('已保存'); setSaving(false) }
  const addService = () => { const newId = Math.max(...services.map(s => s.id), 0) + 1; setServices([...services, { id: newId, name: '新服務', price: 0, time: 60, enabled: true }]) }

  const saveCoupons = async () => { setSaving(true); for (const c of coupons) await supabase.from('coupons').upsert(c); alert('已保存'); setSaving(false) }
  const addCoupon = () => { const newId = Math.max(...coupons.map(c => c.id), 0) + 1; setCoupons([...coupons, { id: newId, code: 'NEW', name: '新優惠', discount: 10, type: 'percent', enabled: true }]) }

  const filteredBookings = bookings.filter(b => (!searchTerm || b.name?.includes(searchTerm) || b.phone?.includes(searchTerm)) && (statusFilter === 'all' || b.status === statusFilter))

  const today = new Date().toLocaleDateString('zh-HK')
  const stats = {
    todayBookings: bookings.filter(b => b.date === today).length,
    todayRevenue: bookings.filter(b => b.date === today).reduce((sum, b) => sum + (b.final_price || 0), 0),
    totalRevenue: bookings.reduce((sum, b) => sum + (b.final_price || 0), 0),
    totalUsers: users.length,
    pending: bookings.filter(b => b.status === 'pending').length,
  }

  const staffStats = staff.map(s => ({ ...s, bookings: bookings.filter(b => b.staff_id === s.id).length, revenue: bookings.filter(b => b.staff_id === s.id).reduce((sum, b) => sum + (b.final_price || 0), 0) }))
  const serviceStats = services.map(s => ({ ...s, bookings: bookings.filter(b => b.service === s.name).length }))
  const days = ['0', '1', '2', '3', '4', '5', '6'], dayNames = ['日', '一', '二', '三', '四', '五', '六']

  if (!isAuthenticated) return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <h1>管理<span style={{ color: '#A68B6A' }}>後台</span></h1>
      <div style={{ maxWidth: '300px', margin: '40px auto', background: '#fff', padding: '30px', borderRadius: '12px' }}>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="密碼" style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px' }} />
        <button onClick={handleLogin} style={{ width: '100%', padding: '12px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px' }}>登入</button>
      </div>
    </div>
  )

  return (
    <div>
      <header style={{ background: '#3D3D3D', color: '#fff', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '20px' }}>管理後台</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'transparent', color: '#fff', border: '1px solid #666', borderRadius: '6px' }}>登出</button>
      </header>
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', overflowX: 'auto' }}>
        <div style={{ display: 'flex' }}>{tabs.map(t => <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '14px 18px', background: activeTab === t.id ? '#A68B6A' : 'transparent', color: activeTab === t.id ? '#fff' : '#666', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}>{t.name}</button>)}</div>
      </div>
      <div style={{ padding: '20px' }}>
        {activeTab === 'dashboard' && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}><div style={{ background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}><div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.todayBookings}</div><div style={{ fontSize: '12px', color: '#666' }}>今日預約</div></div><div style={{ background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}><div style={{ fontSize: '28px', fontWeight: 700, color: '#22c55e' }}>${stats.todayRevenue}</div><div style={{ fontSize: '12px', color: '#666' }}>今日收入</div></div><div style={{ background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}><div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.totalUsers}</div><div style={{ fontSize: '12px', color: '#666' }}>會員</div></div><div style={{ background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}><div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.pending}</div><div style={{ fontSize: '12px', color: '#666' }}>待確認</div></div></div>}
        
        {activeTab === 'analytics' && <div><h3 style={{ marginBottom: '15px' }}>📈 數據分析</h3><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}><div style={{ background: '#fff', padding: '16px', borderRadius: '12px' }}><h4 style={{ marginBottom: '10px', color: '#666' }}>本月收入</h4><div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>${stats.totalRevenue}</div></div><div style={{ background: '#fff', padding: '16px', borderRadius: '12px' }}><h4 style={{ marginBottom: '10px', color: '#666' }}>員工表現</h4>{staffStats.sort((a, b) => b.revenue - a.revenue).slice(0, 3).map(s => <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span>{s.name}</span><strong style={{ color: '#A68B6A' }}>${s.revenue}</strong></div>)}</div><div style={{ background: '#fff', padding: '16px', borderRadius: '12px' }}><h4 style={{ marginBottom: '10px', color: '#666' }}>熱門服務</h4>{serviceStats.sort((a, b) => b.bookings - a.bookings).slice(0, 3).map(s => <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span>{s.name}</span><strong>{s.bookings}次</strong></div>)}</div></div></div>}

        {activeTab === 'bookings' && <div><div style={{ background: '#fff', padding: '12px', borderRadius: '12px', marginBottom: '12px', display: 'flex', gap: '10px' }}><input type="text" placeholder="搜尋" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} /><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}><option value="all">全部</option><option value="pending">待確認</option><option value="confirmed">已確認</option><option value="completed">已完成</option></select></div><div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}><thead><tr style={{ background: '#FAF8F5' }}><th style={{ padding: '10px', textAlign: 'left' }}>客戶</th><th style={{ padding: '10px', textAlign: 'left' }}>服務</th><th style={{ padding: '10px', textAlign: 'left' }}>髮型師</th><th style={{ padding: '10px', textAlign: 'left' }}>日期</th><th style={{ padding: '10px', textAlign: 'left' }}>狀態</th><th style={{ padding: '10px', textAlign: 'left' }}></th></tr></thead><tbody>{filteredBookings.slice(0, 20).map(b => <tr key={b.id} style={{ borderBottom: '1px solid #f5f5f5' }}><td style={{ padding: '10px' }}>{b.name}<div style={{ fontSize: '11px', color: '#999' }}>{b.phone}</div></td><td style={{ padding: '10px' }}>{b.service}</td><td style={{ padding: '10px' }}>{b.staff_name || '-'}</td><td style={{ padding: '10px' }}>{b.date} {b.time}</td><td style={{ padding: '10px' }}><select value={b.status} onChange={e => updateStatus(b.id, e.target.value)} style={{ padding: '4px', fontSize: '11px', borderRadius: '4px', background: b.status === 'pending' ? '#fef3c7' : '#dcfce7' }}><option value="pending">待確認</option><option value="confirmed">已確認</option><option value="completed">已完成</option></select></td><td style={{ padding: '10px' }}><button onClick={() => deleteBooking(b.id)} style={{ padding: '4px 8px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px' }}>刪</button></td></tr>)}</tbody></table></div></div>}

        {activeTab === 'staff' && <div style={{ background: '#fff', padding: '16px', borderRadius: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}><h3>💇 員工</h3><button onClick={addStaff} style={{ padding: '8px 14px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px' }}>+ 新增</button></div>{staff.map((s, i) => <div key={s.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '8px' }}><input type="checkbox" checked={s.enabled} onChange={e => { const n = [...staff]; n[i].enabled = e.target.checked; setStaff(n) }} /><input type="text" value={s.name} onChange={e => { const n = [...staff]; n[i].name = e.target.value; setStaff(n) }} style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} /><select value={s.role} onChange={e => { const n = [...staff]; n[i].role = e.target.value; setStaff(n) }} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}><option>髮型師</option><option>助理</option></select></div>)}<button onClick={saveStaff} disabled={saving} style={{ width: '100%', padding: '12px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', marginTop: '10px' }}>{saving ? '保存中...' : '保存'}</button></div>}

        {activeTab === 'schedule' && <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', overflowX: 'auto' }}><h3 style={{ marginBottom: '15px' }}>📅 排班</h3><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}><thead><tr><th style={{ padding: '8px' }}>員工</th>{dayNames.map(d => <th key={d} style={{ padding: '8px' }}>週{d}</th>)}</tr></thead><tbody>{staff.filter(s => s.enabled).map(s => <tr key={s.id}><td style={{ padding: '8px', fontWeight: 600 }}>{s.name}</td>{days.map(day => <td key={day} style={{ padding: '5px' }}><input type="time" value={s.schedule?.[day]?.start || ''} onChange={e => updateStaffSchedule(s.id, day, 'start', e.target.value)} style={{ width: '70px', padding: '4px', fontSize: '10px', border: '1px solid #ddd', borderRadius: '4px' }} /></td>)}</tr>)}</tbody></table><button onClick={saveStaff} disabled={saving} style={{ width: '100%', padding: '12px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', marginTop: '15px' }}>{saving ? '保存中...' : '保存排班'}</button></div>}

        {activeTab === 'services' && <div style={{ background: '#fff', padding: '16px', borderRadius: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}><h3>✂️ 服務</h3><button onClick={addService} style={{ padding: '8px 14px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px' }}>+ 新增</button></div>{services.map((s, i) => <div key={s.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '8px' }}><input type="checkbox" checked={s.enabled} onChange={e => { const n = [...services]; n[i].enabled = e.target.checked; setServices(n) }} /><input type="text" value={s.name} onChange={e => { const n = [...services]; n[i].name = e.target.value; setServices(n) }} style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} /><input type="number" value={s.price} onChange={e => { const n = [...services]; n[i].price = parseInt(e.target.value); setServices(n) }} style={{ width: '60px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} placeholder="$" /></div>)}<button onClick={saveServices} disabled={saving} style={{ width: '100%', padding: '12px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', marginTop: '10px' }}>{saving ? '保存中...' : '保存'}</button></div>}

        {activeTab === 'coupons' && <div style={{ background: '#fff', padding: '16px', borderRadius: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}><h3>🎫 優惠</h3><button onClick={addCoupon} style={{ padding: '8px 14px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px' }}>+ 新增</button></div>{coupons.map((c, i) => <div key={c.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '8px' }}><input type="checkbox" checked={c.enabled} onChange={e => { const n = [...coupons]; n[i].enabled = e.target.checked; setCoupons(n) }} /><input type="text" value={c.code} onChange={e => { const n = [...coupons]; n[i].code = e.target.value.toUpperCase(); setCoupons(n) }} style={{ width: '80px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', textTransform: 'uppercase' }} /><input type="text" value={c.name} onChange={e => { const n = [...coupons]; n[i].name = e.target.value; setCoupons(n) }} style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} /><input type="number" value={c.discount} onChange={e => { const n = [...coupons]; n[i].discount = parseInt(e.target.value); setCoupons(n) }} style={{ width: '50px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} /></div>)}<button onClick={saveCoupons} disabled={saving} style={{ width: '100%', padding: '12px', background: saving ? '#ccc' : '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', marginTop: '10px' }}>{saving ? '保存中...' : '保存'}</button></div>}

        {activeTab === 'customers' && <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}><thead><tr style={{ background: '#FAF8F5' }}><th style={{ padding: '10px', textAlign: 'left' }}>姓名</th><th style={{ padding: '10px', textAlign: 'left' }}>電話</th><th style={{ padding: '10px', textAlign: 'left' }}>電郵</th><th style={{ padding: '10px', textAlign: 'left' }}>積分</th></tr></thead><tbody>{users.map(u => <tr key={u.id} style={{ borderBottom: '1px solid #f5f5f5' }}><td style={{ padding: '10px' }}>{u.name}</td><td style={{ padding: '10px' }}>{u.phone}</td><td style={{ padding: '10px' }}>{u.email}</td><td style={{ padding: '10px' }}>{u.points || 0}</td></tr>)}</tbody></table></div>}
      </div>
    </div>
  )
}
