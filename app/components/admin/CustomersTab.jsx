'use client'

// Customers Tab Component
export default function CustomersTab({ users }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
        <thead style={{ background: '#f5f5f5' }}>
          <tr>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>姓名</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>電話</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>電郵</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>預約次數</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>總消費</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>註冊日期</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => {
            const userBookings = (typeof window !== 'undefined' && window.bookingsData) ? window.bookingsData.filter(b => b.phone === u.phone) : []
            return (
              <tr key={u.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px', fontSize: '13px' }}>{u.name}</td>
                <td style={{ padding: '12px', fontSize: '13px' }}>{u.phone}</td>
                <td style={{ padding: '12px', fontSize: '13px' }}>{u.email || '-'}</td>
                <td style={{ padding: '12px', fontSize: '13px' }}>{u.booking_count || 0}</td>
                <td style={{ padding: '12px', fontSize: '13px' }}>${u.total_spent || 0}</td>
                <td style={{ padding: '12px', fontSize: '13px' }}>{u.created_at?.split('T')[0]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
