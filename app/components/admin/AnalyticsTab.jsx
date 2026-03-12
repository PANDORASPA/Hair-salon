'use client'

// Analytics Tab Component
export default function AnalyticsTab({ bookings, orders, staff }) {
  // Calculate stats
  const totalRevenue = [...bookings, ...orders].reduce((sum, i) => sum + (i.final_price || i.total || 0), 0)
  const completedBookings = bookings.filter(b => b.status === 'completed').length
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
  
  const staffStats = staff.map(s => ({ 
    ...s, 
    bookings: bookings.filter(b => b.staff_id === s.id).length, 
    revenue: bookings.filter(b => b.staff_id === s.id).reduce((sum, b) => sum + (b.final_price || 0), 0),
    completed: bookings.filter(b => b.staff_id === s.id && b.status === 'completed').length
  }))

  return (
    <div>
      <h3 style={{ marginBottom: '12px' }}>📈 數據分析</h3>
      
      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700 }}>{bookings.length}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>總預約</div>
        </div>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>${totalRevenue}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>總收入</div>
        </div>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#3b82f6' }}>{completedBookings}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>已完成</div>
        </div>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>{confirmedBookings}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>待完成</div>
        </div>
      </div>

      {/* Staff Performance */}
      <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>👥 員工表現</h4>
      <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f5f5f5' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>員工</th>
              <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px' }}>預約</th>
              <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px' }}>完成</th>
              <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px' }}>收入</th>
            </tr>
          </thead>
          <tbody>
            {staffStats.sort((a,b) => b.revenue - a.revenue).map(s => (
              <tr key={s.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px', fontSize: '13px' }}>{s.emoji} {s.name}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px' }}>{s.bookings}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px' }}>{s.completed}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>${s.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
