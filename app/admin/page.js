'use client'

import { useState } from 'react'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'vivahair2026'

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState('dashboard')

  const services = [
    { id: 'cut', name: '剪髮', price: 280, duration: 60, emoji: '✂️', active: true },
    { id: 'color', name: '染髮', price: 680, duration: 120, emoji: '🎨', active: true },
    { id: 'perm', name: '燙髮', price: 880, duration: 150, emoji: '💇', active: true },
    { id: 'treatment', name: '護髮', price: 380, duration: 60, emoji: '🧴', active: true },
  ]

  const staff = [
    { id: 'mark', name: 'Mark', title: '創意總監', emoji: '👨‍💼', active: true },
    { id: 'sophia', name: 'Sophia', title: '高級髮型師', emoji: '👩‍💼', active: true },
  ]

  const tickets = [
    { id: 'basic', name: 'Basic套餐', price: 680, original: 860, visits: 2, active: true },
    { id: 'premium', name: 'Premium套餐', price: 1280, original: 1680, visits: 2, active: true },
  ]

  const bookings = [
    { id: 'BK001', service: '剪髮', staff: 'Mark', date: '2026-03-15', time: '14:00', phone: '9123 4567', status: 'pending', name: '陳先生' },
    { id: 'BK002', service: '染髮', staff: 'Sophia', date: '2026-03-16', time: '10:00', phone: '9876 5432', status: 'confirmed', name: '李小姐' },
  ]

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsLoggedIn(true)
      setError('')
    } else {
      setError('用戶名或密碼錯誤')
    }
  }

  if (!isLoggedIn) {
    return (
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '360px', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #E8E0D5' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#3D3D3D' }}>VIVA HAIR</h2>
            <p style={{ textAlign: 'center', color: '#8A8A8A', marginBottom: '24px', fontSize: '14px' }}>管理員登入</p>
            {error && <div style={{ background: '#ffebee', color: '#F44336', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px' }}>
                <input type="text" placeholder="用戶名" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #E8E0D5', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <input type="password" placeholder="密碼" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #E8E0D5', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              <button type="submit" style={{ width: '100%', padding: '14px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>登入</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#8A8A8A' }}>預設: admin / vivahair2026</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#FAF8F5' }}>
      <div style={{ background: '#A68B6A', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 400 }}>VIVA HAIR 管理後台</h1>
        <button onClick={() => setIsLoggedIn(false)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>登出</button>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
          <button onClick={() => setTab('dashboard')} style={{ padding: '10px 16px', background: tab === 'dashboard' ? '#A68B6A' : '#fff', color: tab === 'dashboard' ? '#fff' : '#3D3D3D', border: '1px solid #E8E0D5', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Dashboard</button>
          <button onClick={() => setTab('bookings')} style={{ padding: '10px 16px', background: tab === 'bookings' ? '#A68B6A' : '#fff', color: tab === 'bookings' ? '#fff' : '#3D3D3D', border: '1px solid #E8E0D5', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>預約</button>
          <button onClick={() => setTab('services')} style={{ padding: '10px 16px', background: tab === 'services' ? '#A68B6A' : '#fff', color: tab === 'services' ? '#fff' : '#3D3D3D', border: '1px solid #E8E0D5', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>服務</button>
          <button onClick={() => setTab('staff')} style={{ padding: '10px 16px', background: tab === 'staff' ? '#A68B6A' : '#fff', color: tab === 'staff' ? '#fff' : '#3D3D3D', border: '1px solid #E8E0D5', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>員工</button>
          <button onClick={() => setTab('tickets')} style={{ padding: '10px 16px', background: tab === 'tickets' ? '#A68B6A' : '#fff', color: tab === 'tickets' ? '#fff' : '#3D3D3D', border: '1px solid #E8E0D5', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>套票</button>
          <button onClick={() => setTab('settings')} style={{ padding: '10px 16px', background: tab === 'settings' ? '#A68B6A' : '#fff', color: tab === 'settings' ? '#fff' : '#3D3D3D', border: '1px solid #E8E0D5', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>設定</button>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #E8E0D5' }}>
          
          {tab === 'dashboard' && (
            <>
              <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>數據概覽</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ background: '#FAF8F5', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', color: '#A68B6A', fontWeight: '700' }}>2</div>
                  <div style={{ fontSize: '14px', color: '#6B6B6B' }}>今日預約</div>
                </div>
                <div style={{ background: '#FAF8F5', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', color: '#FF9800', fontWeight: '700' }}>1</div>
                  <div style={{ fontSize: '14px', color: '#6B6B6B' }}>待確認</div>
                </div>
                <div style={{ background: '#FAF8F5', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', color: '#4CAF50', fontWeight: '700' }}>4</div>
                  <div style={{ fontSize: '14px', color: '#6B6B6B' }}>服務項目</div>
                </div>
              </div>
            </>
          )}

          {tab === 'bookings' && (
            <>
              <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>預約管理</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E8E0D5' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#8A8A8A' }}>編號</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#8A8A8A' }}>姓名</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#8A8A8A' }}>服務</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#8A8A8A' }}>日期</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#8A8A8A' }}>狀態</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#8A8A8A' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #E8E0D5' }}>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{b.id}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{b.name}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{b.service}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{b.date} {b.time}</td>
                      <td style={{ padding: '12px' }}><span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', background: b.status === 'pending' ? '#FFF3E0' : '#E8F5E9', color: b.status === 'pending' ? '#FF9800' : '#4CAF50' }}>{b.status === 'pending' ? '待確認' : '已確認'}</span></td>
                      <td style={{ padding: '12px' }}>
                        <button style={{ padding: '6px 10px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', marginRight: '4px' }}>確認</button>
                        <button style={{ padding: '6px 10px', background: '#ffebee', color: '#F44336', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>取消</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {tab === 'services' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px' }}>服務項目</h2>
                <button style={{ padding: '10px 20px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>+ 新增服務</button>
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {services.map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#FAF8F5', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '24px' }}>{s.emoji}</span>
                      <div>
                        <div style={{ fontWeight: '500' }}>{s.name}</div>
                        <div style={{ fontSize: '12px', color: '#8A8A8A' }}>{s.duration}分鐘</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', color: '#A68B6A' }}>${s.price}</div>
                      </div>
                      <button style={{ padding: '8px 12px', background: '#fff', border: '1px solid #E8E0D5', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>編輯</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'staff' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px' }}>員工管理</h2>
                <button style={{ padding: '10px 20px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>+ 新增員工</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {staff.map((s, i) => (
                  <div key={i} style={{ padding: '20px', background: '#FAF8F5', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '32px' }}>{s.emoji}</span>
                      <div>
                        <div style={{ fontWeight: '500' }}>{s.name}</div>
                        <div style={{ fontSize: '12px', color: '#A68B6A' }}>{s.title}</div>
                      </div>
                    </div>
                    <button style={{ padding: '8px 16px', background: '#fff', border: '1px solid #E8E0D5', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>編輯排班</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'tickets' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px' }}>套票管理</h2>
                <button style={{ padding: '10px 20px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>+ 新增套票</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {tickets.map((t, i) => (
                  <div key={i} style={{ padding: '20px', background: '#FAF8F5', borderRadius: '12px' }}>
                    <div style={{ fontWeight: '500', marginBottom: '8px' }}>{t.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: '600', color: '#A68B6A' }}>${t.price}</span>
                        <span style={{ fontSize: '12px', color: '#8A8A8A', textDecoration: 'line-through', marginLeft: '8px' }}>${t.original}</span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#8A8A8A' }}>{t.visits}次</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'settings' && (
            <>
              <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>基本設定</h2>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>商戶名稱</label>
                  <input type="text" defaultValue="VIVA HAIR" style={{ width: '100%', padding: '12px', border: '1px solid #E8E0D5', borderRadius: '8px', fontSize: '14px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>電話</label>
                    <input type="text" defaultValue="+852 1234 5678" style={{ width: '100%', padding: '12px', border: '1px solid #E8E0D5', borderRadius: '8px', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>WhatsApp</label>
                    <input type="text" defaultValue="+852 1234 5678" style={{ width: '100%', padding: '12px', border: '1px solid #E8E0D5', borderRadius: '8px', fontSize: '14px' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>地址</label>
                  <input type="text" defaultValue="九龍太子通菜街17A 1樓" style={{ width: '100%', padding: '12px', border: '1px solid #E8E0D5', borderRadius: '8px', fontSize: '14px' }} />
                </div>
                <h3 style={{ marginTop: '20px', fontSize: '16px' }}>營業時間</h3>
                {['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'].map((day, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#FAF8F5', borderRadius: '8px' }}>
                    <span style={{ width: '60px', fontWeight: '500' }}>{day}</span>
                    <input type="time" defaultValue="10:00" style={{ padding: '8px', border: '1px solid #E8E0D5', borderRadius: '6px', fontSize: '13px' }} />
                    <span>至</span>
                    <input type="time" defaultValue="20:00" style={{ padding: '8px', border: '1px solid #E8E0D5', borderRadius: '6px', fontSize: '13px' }} />
                  </div>
                ))}
                <button style={{ marginTop: '20px', padding: '14px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>儲存設定</button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
