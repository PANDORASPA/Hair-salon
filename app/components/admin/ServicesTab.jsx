'use client'

// Services Tab Component
export default function ServicesTab({ services, saveServices }) {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => saveServices([...services, { id: Date.now(), name: '', price: 0, time: 60, emoji: '✂️', enabled: true, sort_order: services.length }])} style={{ padding: '10px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ 新增服務</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {services.sort((a,b) => (a.sort_order||0) - (b.sort_order||0)).map(s => (
          <div key={s.id} style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <input value={s.emoji} onChange={(e) => { const n = [...services]; n.find(x => x.id === s.id).emoji = e.target.value; saveServices(n); }} style={{ width: '50px', height: '50px', fontSize: '24px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px' }} />
              <div style={{ flex: 1 }}>
                <input value={s.name} onChange={(e) => { const n = [...services]; n.find(x => x.id === s.id).name = e.target.value; saveServices(n); }} placeholder="服務名稱" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '6px' }} />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input value={s.price} onChange={(e) => { const n = [...services]; n.find(x => x.id === s.id).price = parseInt(e.target.value) || 0; saveServices(n); }} type="number" placeholder="價格" style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                  <input value={s.time} onChange={(e) => { const n = [...services]; n.find(x => x.id === s.id).time = parseInt(e.target.value) || 60; saveServices(n); }} type="number" placeholder="分鐘" style={{ width: '70px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                  <span style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#666' }}>分</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" checked={s.enabled} onChange={(e) => { const n = [...services]; n.find(x => x.id === s.id).enabled = e.target.checked; saveServices(n); }} />
                啟用
              </label>
              <button onClick={() => saveServices(services.filter(x => x.id !== s.id))} style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>刪除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
