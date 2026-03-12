'use client'

// Bookings Tab Component
export default function BookingsTab({ bookings, statusFilter, setStatusFilter, searchTerm, setSearchTerm, setSelectedBooking }) {
  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="搜尋預約..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px', minWidth: '200px' }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <option value="all">全部狀態</option>
          <option value="pending">待確認</option>
          <option value="confirmed">已確認</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
          <option value="no_show">no_show</option>
        </select>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
          <thead style={{ background: '#f5f5f5' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>編號</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>客戶</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>服務</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>髮型師</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>日期</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>時間</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>狀態</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>金額</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>動作</th>
            </tr>
          </thead>
          <tbody>
            {bookings
              .filter(b => statusFilter === 'all' || b.status === statusFilter)
              .filter(b => !searchTerm || b.name?.includes(searchTerm) || b.phone?.includes(searchTerm) || b.booking_ref?.includes(searchTerm))
              .slice(0, 50)
              .map(b => (
                <tr key={b.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{b.booking_ref}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{b.name}<br/><span style={{ color: '#999', fontSize: '11px' }}>{b.phone}</span></td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{b.service}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{b.staff_name}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{b.date}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{b.time}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', background: b.status === 'confirmed' ? '#dcfce7' : b.status === 'pending' ? '#fef3c7' : b.status === 'completed' ? '#dbeafe' : b.status === 'cancelled' ? '#fee2e2' : '#f3f4f6', color: b.status === 'confirmed' ? '#16a34a' : b.status === 'pending' ? '#d97706' : b.status === 'completed' ? '#2563eb' : b.status === 'cancelled' ? '#dc2626' : '#666' }}>
                      {b.status === 'pending' ? '待確認' : b.status === 'confirmed' ? '已確認' : b.status === 'completed' ? '已完成' : b.status === 'cancelled' ? '已取消' : 'no_show'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>${b.final_price || b.price}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>
                    <button onClick={() => setSelectedBooking(b)} style={{ padding: '6px 10px', background: '#f5f5f5', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>詳情</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
