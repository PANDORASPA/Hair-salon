'use client'
import { useMemo } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  LineChart, Line, Legend, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts'

export default function AnalyticsTab({ bookings, orders, reviews = [] }) {
  // Calculate analytics
  const analytics = useMemo(() => {
    const now = new Date();
    
    // 0. Review Stats
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;
    
    // 1. Monthly Revenue Trend
    const monthlyData = {};
    bookings.forEach(b => {
      if (b.status === 'cancelled') return;
      const parts = b.date.split('/');
      if (parts.length === 3) {
        const m = parseInt(parts[1]);
        const y = parseInt(parts[2]);
        const key = `${y}-${String(m).padStart(2, '0')}`;
        monthlyData[key] = (monthlyData[key] || 0) + (b.final_price || 0);
      }
    });
    
    const monthlyTrend = Object.entries(monthlyData)
      .sort()
      .slice(-12) // Last 12 months
      .map(([name, value]) => ({ name, revenue: value }));

    // 2. Service Popularity (Top 5)
    const serviceStats = {};
    bookings.forEach(b => {
      if (b.status === 'cancelled') return;
      serviceStats[b.service] = (serviceStats[b.service] || 0) + 1;
    });
    
    const servicePopularity = Object.entries(serviceStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, count: value }));

    // 3. Stylist Performance (Revenue)
    const stylistRevenue = {};
    bookings.forEach(b => {
      if (b.status === 'completed' || b.status === 'confirmed') {
        const name = b.staff_name || '未分配';
        stylistRevenue[name] = (stylistRevenue[name] || 0) + (b.final_price || 0);
      }
    });

    const stylistPerformance = Object.entries(stylistRevenue)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value]) => ({ name, revenue: value }));

    // 4. Booking Status Distribution
    const statusStats = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    bookings.forEach(b => {
      if (statusStats[b.status] !== undefined) statusStats[b.status]++;
    });
    const statusDistribution = [
      { name: '待確認', value: statusStats.pending, color: '#f59e0b' },
      { name: '已確認', value: statusStats.confirmed, color: '#10b981' },
      { name: '已完成', value: statusStats.completed, color: '#3b82f6' },
      { name: '已取消', value: statusStats.cancelled, color: '#ef4444' },
    ].filter(i => i.value > 0);

    return {
      monthlyTrend,
      servicePopularity,
      stylistPerformance,
      statusDistribution,
      avgRating,
      totalReviews: reviews.length,
      recentReviews: reviews.slice(0, 5)
    };
  }, [bookings, reviews]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div>
      {/* Review Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="admin-card" style={{ padding: '24px', borderLeft: '5px solid #F59E0B' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>平均滿意度</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#F59E0B' }}>{analytics.avgRating}</div>
            <div style={{ fontSize: '14px', color: '#F59E0B', fontWeight: 600 }}>⭐ / 5.0</div>
          </div>
        </div>
        <div className="admin-card" style={{ padding: '24px', borderLeft: '5px solid #8B5CF6' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>總評論數</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#8B5CF6' }}>{analytics.totalReviews}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-light)', fontWeight: 600 }}>則評論</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
      
      {/* Monthly Revenue Trend */}
      <div className="admin-card" style={{ padding: '24px', minHeight: '400px' }}>
        <h3 style={{ marginBottom: '24px', fontSize: '16px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📈</span> 月度營收趨勢
        </h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={analytics.monthlyTrend}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A68B6A" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#A68B6A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} tickFormatter={val => `$${val}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(val) => [`$${val.toLocaleString()}`, '營收']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#A68B6A" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Popularity */}
      <div className="admin-card" style={{ padding: '24px', minHeight: '400px' }}>
        <h3 style={{ marginBottom: '24px', fontSize: '16px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔥</span> 熱門服務排行
        </h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart layout="vertical" data={analytics.servicePopularity} margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 13, fontWeight: 600}} width={100} />
              <Tooltip cursor={{fill: 'rgba(0,0,0,0.03)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#A68B6A" radius={[0, 4, 4, 0]} barSize={30}>
                {analytics.servicePopularity.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={index < 3 ? '#A68B6A' : '#D1D5DB'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stylist Performance */}
      <div className="admin-card" style={{ padding: '24px', minHeight: '400px' }}>
        <h3 style={{ marginBottom: '24px', fontSize: '16px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🏆</span> 髮型師業績排行
        </h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={analytics.stylistPerformance}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} tickFormatter={val => `$${val}`} />
              <Tooltip formatter={(val) => [`$${val.toLocaleString()}`, '總業績']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="revenue" fill="#3D3D3D" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Booking Status Distribution */}
      <div className="admin-card" style={{ padding: '24px', minHeight: '400px' }}>
        <h3 style={{ marginBottom: '24px', fontSize: '16px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📊</span> 預約狀態分佈
        </h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={analytics.statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {analytics.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Reviews List */}
      <div className="admin-card" style={{ padding: '24px', minHeight: '400px' }}>
        <h3 style={{ marginBottom: '24px', fontSize: '16px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>💬</span> 最新顧客評價
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {analytics.recentReviews.length === 0 ? (
            <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '40px 0' }}>暫無評價數據</p>
          ) : (
            analytics.recentReviews.map((review, idx) => (
              <div key={idx} style={{ paddingBottom: '16px', borderBottom: idx < analytics.recentReviews.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>
                    {review.rating} ⭐ <span style={{ color: 'var(--text-light)', fontWeight: 400, fontSize: '12px' }}> - {new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.5 }}>
                  {review.comment || '無文字評論'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
    </div>
  )
}
