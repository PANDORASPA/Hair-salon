'use client'

// Tickets Tab Component
export default function TicketsTab({ tickets, saveTickets }) {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => saveTickets([...tickets, { id: Date.now(), name: '', price: 0, times: 10, img: '🎫', enabled: true }])} style={{ padding: '10px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ 新增套票</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {tickets.map(t => (
          <div key={t.id} style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <input value={t.img} onChange={(e) => { const n = [...tickets]; n.find(x => x.id === t.id).img = e.target.value; saveTickets(n); }} style={{ width: '50px', height: '50px', fontSize: '24px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px' }} />
              <div style={{ flex: 1 }}>
                <input value={t.name} onChange={(e) => { const n = [...tickets]; n.find(x => x.id === t.id).name = e.target.value; saveTickets(n); }} placeholder="套票名稱" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '6px' }} />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input value={t.price} onChange={(e) => { const n = [...tickets]; n.find(x => x.id === t.id).price = parseInt(e.target.value) || 0; saveTickets(n); }} type="number" placeholder="價格" style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                  <input value={t.times} onChange={(e) => { const n = [...tickets]; n.find(x => x.id === t.id).times = parseInt(e.target.value) || 1; saveTickets(n); }} type="number" placeholder="次數" style={{ width: '70px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" checked={t.enabled} onChange={(e) => { const n = [...tickets]; n.find(x => x.id === t.id).enabled = e.target.checked; saveTickets(n); }} />
                啟用
              </label>
              <button onClick={() => saveTickets(tickets.filter(x => x.id !== t.id))} style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>刪除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
