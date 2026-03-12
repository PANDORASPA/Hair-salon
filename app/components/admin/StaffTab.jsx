'use client'

// Staff Tab Component
export default function StaffTab({ staff, saveStaff }) {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => saveStaff([...staff, { id: Date.now(), name: '', role: '髮型師', emoji: '💇', enabled: true, schedule: {}, daysOff: [] }])} style={{ padding: '10px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ 新增員工</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {staff.map(s => (
          <div key={s.id} style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '60px', height: '60px', background: '#f5f5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>{s.emoji}</div>
              <div style={{ flex: 1 }}>
                <input value={s.name} onChange={(e) => { const n = [...staff]; n.find(x => x.id === s.id).name = e.target.value; saveStaff(n); }} placeholder="姓名" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '6px' }} />
                <input value={s.role} onChange={(e) => { const n = [...staff]; n.find(x => x.id === s.id).role = e.target.value; saveStaff(n); }} placeholder="職位" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" checked={s.enabled} onChange={(e) => { const n = [...staff]; n.find(x => x.id === s.id).enabled = e.target.checked; saveStaff(n); }} />
                啟用
              </label>
              <button onClick={() => saveStaff(staff.filter(x => x.id !== s.id))} style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>刪除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
