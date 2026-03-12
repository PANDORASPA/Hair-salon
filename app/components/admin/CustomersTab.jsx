'use client'

import { useState } from 'react'

export default function CustomersTab({ users, bookings, onUpdateCustomer }) {
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
      <div className="admin-card" style={{ overflow: 'hidden', flex: selectedCustomer ? '1' : '100%' }}>
        <div className="hide-scrollbar" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: '#FAF8F5', borderBottom: '1px solid var(--gray)' }}>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-light)' }}>客戶資訊</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-light)' }}>會員等級</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-light)' }}>消費概況</th>
                {!selectedCustomer && <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-light)' }}>備註</th>}
                <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 700, color: 'var(--text-light)' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-light)' }}>
                    📭 尚未有客戶資料
                  </td>
                </tr>
              ) : (
                users.map(u => {
                  const userBookings = bookings ? bookings.filter(b => b.phone === u.phone) : [];
                  const totalSpent = userBookings.reduce((acc, b) => acc + (b.final_price || 0), 0);
                  const isSelected = selectedCustomer?.id === u.id;
                  
                  return (
                    <tr 
                      key={u.id} 
                      className="admin-table-row" 
                      style={{ 
                        borderBottom: '1px solid #f9f9f9',
                        background: isSelected ? 'rgba(166, 139, 106, 0.05)' : '#fff',
                        borderLeft: isSelected ? '4px solid var(--primary)' : '4px solid transparent'
                      }}
                      onClick={() => setSelectedCustomer(u)}
                    >
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{u.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>📱 {u.phone}</div>
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <select 
                          value={u.membership_level || 'Regular'} 
                          onChange={(e) => onUpdateCustomer(u.id, { membership_level: e.target.value })}
                          onClick={(e) => e.stopPropagation()}
                          className="btn-interactive"
                          style={{ padding: '6px 10px', fontSize: '12px', width: 'auto' }}
                        >
                          <option value="Regular">普通會員</option>
                          <option value="Silver">銀卡會員</option>
                          <option value="Gold">金卡會員</option>
                          <option value="VIP">VIP 至尊會員</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>${totalSpent.toLocaleString()}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{userBookings.length} 次預約</div>
                      </td>
                      {!selectedCustomer && (
                        <td style={{ padding: '14px 12px' }}>
                          <input 
                            type="text" 
                            value={u.notes || ''} 
                            placeholder="點擊添加..."
                            onBlur={(e) => onUpdateCustomer(u.id, { notes: e.target.value })}
                            onClick={(e) => e.stopPropagation()}
                            style={{ padding: '8px 12px', fontSize: '12px', border: '1px solid transparent', background: '#f9fafb', width: '100%' }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                          />
                        </td>
                      )}
                      <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                        <button className="btn-interactive" style={{ padding: '6px 12px', fontSize: '12px', background: '#f3f4f6', borderRadius: '6px' }}>
                          詳情
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && (
        <div className="admin-card" style={{ flex: '1', minWidth: '350px', padding: '24px', position: 'sticky', top: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>👤 客戶詳情</h3>
            <button onClick={() => setSelectedCustomer(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#999' }}>×</button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 700 }}>
              {selectedCustomer.name?.charAt(0)}
            </div>
            <h2 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>{selectedCustomer.name}</h2>
            <div style={{ color: 'var(--text-light)', fontSize: '14px' }}>{selectedCustomer.phone}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>現有積分</div>
              <input 
                type="number" 
                value={selectedCustomer.points || 0}
                onChange={(e) => onUpdateCustomer(selectedCustomer.id, { points: parseInt(e.target.value) || 0 })}
                style={{ width: '60px', textAlign: 'center', border: 'none', background: 'transparent', fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}
              />
            </div>
            <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>註冊日期</div>
              <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                {selectedCustomer.created_at ? new Date(selectedCustomer.created_at).toLocaleDateString() : '-'}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', display: 'block' }}>管理員備註</label>
            <textarea 
              value={selectedCustomer.notes || ''}
              onChange={(e) => {
                const updated = { ...selectedCustomer, notes: e.target.value };
                setSelectedCustomer(updated); // Update local state immediately
                // Debounce or update on blur would be better, but for now simple update
              }}
              onBlur={(e) => onUpdateCustomer(selectedCustomer.id, { notes: e.target.value })}
              placeholder="輸入備註..."
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', minHeight: '80px', fontSize: '13px' }}
            />
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>📅 近期預約</h4>
            <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }} className="hide-scrollbar">
              {bookings && bookings.filter(b => b.phone === selectedCustomer.phone).length > 0 ? (
                bookings
                  .filter(b => b.phone === selectedCustomer.phone)
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map(b => (
                    <div key={b.id} style={{ padding: '12px', border: '1px solid #f0f0f0', borderRadius: '8px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600 }}>{b.service}</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>${b.final_price}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#999' }}>
                        <span>{b.date}</span>
                        <span className={`badge ${b.status === 'confirmed' ? 'badge-success' : 'badge-outline'}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px', fontSize: '13px' }}>無預約紀錄</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
