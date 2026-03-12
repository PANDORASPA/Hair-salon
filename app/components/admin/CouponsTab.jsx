'use client'
import { useState, useEffect } from 'react'

// Coupons Tab Component
export default function CouponsTab({ coupons: initialCoupons, saveCoupons }) {
  const [coupons, setCoupons] = useState(initialCoupons || []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCoupons(initialCoupons || []);
  }, [initialCoupons]);

  const handleSave = async () => {
    setSaving(true);
    await saveCoupons(coupons);
    setSaving(false);
  };

  const updateCoupon = (id, field, value) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const updateNestedCoupon = (id, field, value) => {
     // Not needed for flat structure, but keeping consistent naming
     updateCoupon(id, field, value);
  }

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <button 
          onClick={() => setCoupons([{ id: Date.now(), code: '', name: '', discount: 0, type: 'fixed', enabled: true, usage_limit: 0, start_date: null, end_date: null }, ...coupons])} 
          className="btn btn-small btn-interactive"
        >
          + 新增優惠碼
        </button>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="btn btn-small btn-interactive" 
          style={{ background: '#34D399' }}
        >
          {saving && <span className="spinner"></span>}
          {saving ? '儲存中...' : '💾 儲存變更'}
        </button>
      </div>

      <div className="grid">
        {coupons.map(c => (
          <div key={c.id} className="admin-card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label>優惠代碼</label>
              <input 
                value={c.code || ''} 
                onChange={(e) => updateCoupon(c.id, 'code', e.target.value)} 
                placeholder="例如: WELCOME2026" 
                style={{ fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }} 
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>優惠名稱</label>
              <input 
                value={c.name || ''} 
                onChange={(e) => updateCoupon(c.id, 'name', e.target.value)} 
                placeholder="例如: 新客首單優惠" 
              />
            </div>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label>折扣類型</label>
                <select value={c.type || 'fixed'} onChange={(e) => updateCoupon(c.id, 'type', e.target.value)}>
                  <option value="fixed">定額扣減 ($)</option>
                  <option value="percent">百分比折扣 (%)</option>
                </select>
              </div>
              <div>
                <label>折扣數值</label>
                <input 
                  value={c.discount || 0} 
                  onChange={(e) => updateCoupon(c.id, 'discount', parseInt(e.target.value) || 0)} 
                  type="number" 
                  placeholder={c.type === 'fixed' ? '金額' : '折數'} 
                />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>使用次數上限 (0為不限)</label>
              <input 
                value={c.usage_limit || 0} 
                onChange={(e) => updateCoupon(c.id, 'usage_limit', parseInt(e.target.value) || 0)} 
                type="number" 
              />
            </div>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label>開始日期</label>
                <input 
                  type="date" 
                  value={c.start_date ? (typeof c.start_date === 'string' ? c.start_date.split('T')[0] : '') : ''} 
                  onChange={(e) => updateCoupon(c.id, 'start_date', e.target.value)} 
                />
              </div>
              <div>
                <label>結束日期</label>
                <input 
                  type="date" 
                  value={c.end_date ? (typeof c.end_date === 'string' ? c.end_date.split('T')[0] : '') : ''} 
                  onChange={(e) => updateCoupon(c.id, 'end_date', e.target.value)} 
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--gray)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                <input 
                  type="checkbox" 
                  checked={c.enabled || false} 
                  onChange={(e) => updateCoupon(c.id, 'enabled', e.target.checked)} 
                  style={{ width: 'auto' }}
                />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>啟用代碼</span>
              </label>
              <button 
                onClick={() => setCoupons(coupons.filter(x => x.id !== c.id))} 
                className="btn-interactive"
                style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
              >
                刪除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
