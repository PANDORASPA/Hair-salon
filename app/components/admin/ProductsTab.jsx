'use client'

// Products Tab Component
export default function ProductsTab({ products, searchTermProduct, setSearchTermProduct, saveProducts }) {
  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <input
          type="text"
          placeholder="搜尋產品..."
          value={searchTermProduct}
          onChange={(e) => setSearchTermProduct(e.target.value)}
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px', minWidth: '200px', maxWidth: '300px' }}
        />
        <button onClick={() => saveProducts([...products, { id: Date.now(), name: '', price: 0, emoji: '💄', enabled: true }])} style={{ padding: '10px 16px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ 新增產品</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {products.filter(p => !searchTermProduct || p.name?.includes(searchTermProduct)).map(p => (
          <div key={p.id} style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <input value={p.emoji} onChange={(e) => { const n = [...products]; n.find(x => x.id === p.id).emoji = e.target.value; saveProducts(n); }} style={{ width: '50px', height: '50px', fontSize: '24px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px' }} />
              <div style={{ flex: 1 }}>
                <input value={p.name} onChange={(e) => { const n = [...products]; n.find(x => x.id === p.id).name = e.target.value; saveProducts(n); }} placeholder="產品名稱" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '6px' }} />
                <input value={p.price} onChange={(e) => { const n = [...products]; n.find(x => x.id === p.id).price = parseInt(e.target.value) || 0; saveProducts(n); }} type="number" placeholder="價格" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" checked={p.enabled} onChange={(e) => { const n = [...products]; n.find(x => x.id === p.id).enabled = e.target.checked; saveProducts(n); }} />
                啟用
              </label>
              <button onClick={() => saveProducts(products.filter(x => x.id !== p.id))} style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>刪除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
