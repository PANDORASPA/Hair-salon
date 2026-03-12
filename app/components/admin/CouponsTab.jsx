'use client'

// Coupons Tab Component
export default function CouponsTab({ coupons, saveCoupons }) {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => saveCoupons([...coupons, { id: Date.now(), code: '', name: '', discount: 0, type: 'fixed', enabled: true }])} style={{ padding: '10px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ 新增優惠碼</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {coupons.map(c => (
          <div key={c.id} style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #eee' }}>
            <div style={{ marginBottom: '12px' }}>
              <input value={c.code} onChange={(e) => { const n = [...coupons]; n.find(x => x.id === c.id).code = e.target.value; saveCoupons(n); }} placeholder="優惠碼" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '6px', fontFamily: 'monospace' }} />
              <input value={c.name} onChange={(e) => { const n = [...coupons]; n.find(x => x.id === c.id).name = e.target.value; saveCoupons(n); }} placeholder="優惠名稱" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '6px' }} />
              <div style={{ display: 'flex', gap: '6px' }}>
                <select value={c.type} onChange={(e) => { const n = [...coupons]; n.find(x => x.id === c.id).type = e.target.value; saveCoupons(n); }} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}>
                  <option value="fixed">減$</option>
                  <option value="percent">折</option>
                </select>
                <input value={c.discount} onChange={(e) => { const n = [...coupons]; n.find(x => x.id === c.id).discount = parseInt(e.target.value) || 0; saveCoupons(n); }} type="number" placeholder="金額/折" style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" checked={c.enabled} onChange={(e) => { const n = [...coupons]; n.find(x => x.id === c.id).enabled = e.target.checked; saveCoupons(n); }} />
                啟用
              </label>
              <button onClick={() => saveCoupons(coupons.filter(x => x.id !== c.id))} style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>刪除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
