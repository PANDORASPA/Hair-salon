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
  const router = useRouter()

  // 密碼 (可以改)
  const ADMIN_PASSWORD = 'viva2026'

  useEffect(() => {
    // 檢查是否已經登入
    const auth = localStorage.getItem('viva_admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchBookings()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) {
      setBookings(data)
    }
    setLoading(false)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('viva_admin_auth', 'true')
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('密碼錯誤，請重試')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('viva_admin_auth')
    setIsAuthenticated(false)
    setPassword('')
    router.push('/')
  }

  const updateStatus = (ref, newStatus) => {
    const updated = bookings.map(b => 
      b.ref === ref ? { ...b, status: newStatus } : b
    )
    setBookings(updated)
    localStorage.setItem('viva_bookings', JSON.stringify(updated))
  }

  const deleteBooking = (ref) => {
    if (confirm('確定要刪除呢個預約嗎？')) {
      const updated = bookings.filter(b => b.ref !== ref)
      setBookings(updated)
      localStorage.setItem('viva_bookings', JSON.stringify(updated))
    }
  }

  const stats = {
    totalBookings: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  }

  // 登入畫面
  if (!isAuthenticated) {
    return (
      <>
        <section style={{ padding: '40px 0', background: '#FAF8F5', textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', color: '#3D3D3D' }}>管理<span style={{ color: '#A68B6A' }}>後台</span></h1>
        </section>

        <section style={{ padding: '60px 20px' }}>
          <div style={{ maxWidth: '400px', margin: '0 auto', background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔐</div>
              <h2 style={{ color: '#3D3D3D' }}>請輸入密碼</h2>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>管理員專區</p>
            </div>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '20px' }}>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="請輸入密碼"
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    border: error ? '2px solid #ef4444' : '2px solid #e5e7eb', 
                    borderRadius: '8px',
                    fontSize: '16px',
                    textAlign: 'center'
                  }}
                />
                {error && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px', textAlign: 'center' }}>{error}</p>}
              </div>

              <button 
                type="submit"
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  background: 'linear-gradient(135deg, #A68B6A, #8B7355)', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 600
                }}
              >
                登入
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#999' }}>
              <a href="/" style={{ color: '#A68B6A', textDecoration: 'none' }}>返回首頁</a>
            </p>
          </div>
        </section>
      </>
    )
  }

  // 管理後台
  return (
    <>
      <section style={{ padding: '30px 0', background: '#3D3D3D', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px' }}>管理後台</h1>
            <p style={{ opacity: 0.7, fontSize: '14px' }}>VIVA HAIR 預約管理系統</p>
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '10px 20px', 
              background: 'transparent', 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.3)', 
              borderRadius: '8px', 
              cursor: 'pointer' 
            }}
          >
            登出
          </button>
        </div>
      </section>

      <section style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>總預約</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#3D3D3D' }}>{stats.totalBookings}</div>
            </div>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>待確認</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b' }}>{stats.pending}</div>
            </div>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>已確認</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#22c55e' }}>{stats.confirmed}</div>
            </div>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>已完成</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#A68B6A' }}>{stats.completed}</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
              {['bookings', 'services', 'products', 'settings'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '15px 25px',
                    background: activeTab === tab ? '#A68B6A' : 'transparent',
                    color: activeTab === tab ? '#fff' : '#666',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}
                >
                  {tab === 'bookings' && '📅 預約管理'}
                  {tab === 'services' && '✂️ 服務項目'}
                  {tab === 'products' && '🛍️ 產品管理'}
                  {tab === 'settings' && '⚙️ 系統設定'}
                </button>
              ))}
            </div>

            <div style={{ padding: '20px' }}>
              {activeTab === 'bookings' && (
                <>
                  <h3 style={{ marginBottom: '20px' }}>預約記錄</h3>
                  {bookings.length === 0 ? (
                    <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>暫時未有預約記錄</p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #eee' }}>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontSize: '14px' }}>編號</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontSize: '14px' }}>客戶</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontSize: '14px' }}>服務</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontSize: '14px' }}>日期</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontSize: '14px' }}>時間</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontSize: '14px' }}>金額</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontSize: '14px' }}>狀態</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontSize: '14px' }}>操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #f5f5f5' }}>
                              <td style={{ padding: '12px', fontWeight: 600, fontSize: '14px' }}>{booking.ref}</td>
                              <td style={{ padding: '12px', fontSize: '14px' }}>
                                <div>{booking.name}</div>
                                <div style={{ fontSize: '12px', color: '#999' }}>{booking.phone}</div>
                              </td>
                              <td style={{ padding: '12px', fontSize: '14px' }}>{booking.service}</td>
                              <td style={{ padding: '12px', fontSize: '14px' }}>{booking.date}</td>
                              <td style={{ padding: '12px', fontSize: '14px' }}>{booking.time}</td>
                              <td style={{ padding: '12px', fontWeight: 600, color: '#A68B6A', fontSize: '14px' }}>${booking.finalPrice}</td>
                              <td style={{ padding: '12px' }}>
                                <span style={{ 
                                  padding: '4px 10px', 
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  background: booking.status === 'pending' ? '#fef3c7' : '#dcfce7',
                                  color: booking.status === 'pending' ? '#d97706' : '#16a34a'
                                }}>
                                  {booking.status === 'pending' ? '待確認' : '已確認'}
                                </span>
                              </td>
                              <td style={{ padding: '12px' }}>
                                {booking.status === 'pending' && (
                                  <button 
                                    onClick={() => updateStatus(booking.ref, 'confirmed')}
                                    style={{ padding: '6px 12px', marginRight: '5px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                  >
                                    確認
                                  </button>
                                )}
                                {booking.status === 'confirmed' && (
                                  <button 
                                    onClick={() => updateStatus(booking.ref, 'completed')}
                                    style={{ padding: '6px 12px', marginRight: '5px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                  >
                                    完成
                                  </button>
                                )}
                                <button 
                                  onClick={() => deleteBooking(booking.ref)}
                                  style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                >
                                  刪除
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'services' && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  <p>服務項目管理 - 即將推出</p>
                </div>
              )}

              {activeTab === 'products' && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  <p>產品管理 - 即將推出</p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  <p>系統設定 - 即將推出</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
