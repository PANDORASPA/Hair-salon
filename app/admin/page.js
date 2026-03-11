'use client'

import { useState, useEffect } from 'react'

export default function Admin() {
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('bookings')

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('viva_bookings') || '[]')
    setBookings(storedBookings.reverse())
  }, [])

  const stats = {
    totalBookings: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  }

  return (
    <>
      <section style={{ padding: '30px 0', background: '#3D3D3D', color: '#fff' }}>
        <div className="container">
          <h1 style={{ fontSize: '28px' }}>管理後台</h1>
          <p style={{ opacity: 0.7 }}>VIVA HAIR 預約管理系統</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
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
                    fontWeight: 600
                  }}
                >
                  {tab === 'bookings' && '📅 '}
                  {tab === 'services' && '✂️ '}
                  {tab === 'products' && '🛍️ '}
                  {tab === 'settings' && '⚙️ '}
                  {tab === 'bookings' && '預約管理'}
                  {tab === 'services' && '服務項目'}
                  {tab === 'products' && '產品管理'}
                  {tab === 'settings' && '系統設定'}
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
                            <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>編號</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>客戶</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>服務</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>日期</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>時間</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>金額</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>狀態</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #f5f5f5' }}>
                              <td style={{ padding: '12px', fontWeight: 600 }}>{booking.ref}</td>
                              <td style={{ padding: '12px' }}>
                                <div>{booking.name}</div>
                                <div style={{ fontSize: '12px', color: '#999' }}>{booking.phone}</div>
                              </td>
                              <td style={{ padding: '12px' }}>{booking.service}</td>
                              <td style={{ padding: '12px' }}>{booking.date}</td>
                              <td style={{ padding: '12px' }}>{booking.time}</td>
                              <td style={{ padding: '12px', fontWeight: 600, color: '#A68B6A' }}>${booking.finalPrice}</td>
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
                                <button style={{ padding: '6px 12px', marginRight: '5px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                  確認
                                </button>
                                <button style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                  取消
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
