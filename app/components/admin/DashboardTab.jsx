'use client'

// Dashboard Tab Component
export default function DashboardTab({ stats, bookings, orders }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
      <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.todayBookings}</div>
        <div style={{ fontSize: '11px', color: '#666' }}>今日預約</div>
      </div>
      <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>${stats.todayRevenue}</div>
        <div style={{ fontSize: '11px', color: '#666' }}>今日收入</div>
      </div>
      <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.totalUsers}</div>
        <div style={{ fontSize: '11px', color: '#666' }}>會員</div>
      </div>
      <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.pending}</div>
        <div style={{ fontSize: '11px', color: '#666' }}>待確認</div>
      </div>
    </div>
  )
}
