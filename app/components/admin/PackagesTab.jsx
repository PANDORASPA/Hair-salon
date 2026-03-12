'use client'

// Packages Tab Component
export default function PackagesTab({ servicePackages, saveServicePackages }) {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => saveServicePackages([...servicePackages, { id: Date.now(), name: '', description: '', price: 0, orig: 0, emoji: '💎', enabled: true }])} style={{ padding: '10px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ 新增套餐</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {servicePackages.map(p => (
          <div key={p.id} style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '2px solid #A68B6A' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <input value={p.emoji} onChange={(e) => { const n = [...servicePackages]; n.find(x => x.id === p.id).emoji = e.target.value; saveServicePackages(n); }} style={{ width: '50px', height: '50px', fontSize: '24px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px' }} />
              <div style={{ flex: 1 }}>
                <input value={p.name} onChange={(e) => { const n = [...servicePackages]; n.find(x => x.id === p.id).name = e.target.value; saveServicePackages(n); }} placeholder="套餐名稱" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '6px' }} />
                <input value={p.description} onChange={(e) => { const n = [...servicePackages]; n.find(x => x.id === p.id).description = e.target.value; saveServicePackages(n); }} placeholder="描述" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '6px' }} />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input value={p.price} onChange={(e) => { const n = [...servicePackages]; n.find(x => x.id === p.id).price = parseInt(e.target.value) || 0; saveServicePackages(n); }} type="number" placeholder="套餐價" style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                  <input value={p.orig} onChange={(e) => { const n = [...servicePackages]; n.find(x => x.id === p.id).orig = parseInt(e.target.value) || 0; saveServicePackages(n); }} type="number" placeholder="原價" style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" checked={p.enabled} onChange={(e) => { const n = [...servicePackages]; n.find(x => x.id === p.id).enabled = e.target.checked; saveServicePackages(n); }} />
                啟用
              </label>
              <button onClick={() => saveServicePackages(servicePackages.filter(x => x.id !== p.id))} style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>刪除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
