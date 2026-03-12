'use client'

// Orders Tab Component
export default function OrdersTab({ orders, orderStatusFilter, setOrderStatusFilter, searchTermOrder, setSearchTermOrder }) {
  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="搜尋訂單..."
          value={searchTermOrder}
          onChange={(e) => setSearchTermOrder(e.target.value)}
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px', minWidth: '200px' }}
        />
        <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <option value="all">全部狀態</option>
          <option value="pending">待處理</option>
          <option value="paid">已付款</option>
          <option value="shipped">已寄出</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
          <thead style={{ background: '#f5f5f5' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>訂單編號</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>客戶</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>產品</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>數量</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>金額</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>狀態</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>日期</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter(o => orderStatusFilter === 'all' || o.status === orderStatusFilter)
              .filter(o => !searchTermOrder || o.name?.includes(searchTermOrder) || o.order_ref?.includes(searchTermOrder))
              .slice(0, 50)
              .map(o => (
                <tr key={o.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{o.order_ref}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{o.name}<br/><span style={{ color: '#999', fontSize: '11px' }}>{o.phone}</span></td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{o.product_name}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{o.quantity}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>${o.total}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', background: o.status === 'paid' ? '#dcfce7' : o.status === 'pending' ? '#fef3c7' : o.status === 'shipped' ? '#dbeafe' : o.status === 'completed' ? '#dcfce7' : '#fee2e2', color: o.status === 'paid' ? '#16a34a' : o.status === 'pending' ? '#d97706' : o.status === 'shipped' ? '#2563eb' : o.status === 'completed' ? '#16a34a' : '#dc2626' }}>
                      {o.status === 'pending' ? '待處理' : o.status === 'paid' ? '已付款' : o.status === 'shipped' ? '已寄出' : o.status === 'completed' ? '已完成' : '已取消'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{o.created_at?.split('T')[0]}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
