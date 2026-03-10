'use client'

const ARTICLES = [
  { id: 1, title: '點樣保護染髮後既頭髮？', category: '護理', emoji: '🎨', date: '2026-03-01', excerpt: '分享染髮後護理既重要知識，等你既髮色更持久...' },
  { id: 2, title: '2026髮型趨勢預測', category: '潮流', emoji: '💇', date: '2026-02-15', excerpt: '今年流行咩髮型？話你知以下幾款大熱...'},
  { id: 3, title: '燙髮前要知既5件事', category: '教學', emoji: '💆', date: '2026-02-01', excerpt: '燙髮前既準備工作，等你燙得更滿意...'},
  { id: 4, title: '頭髮乾枯點算？', category: '護理', emoji: '🧴', date: '2026-01-20', excerpt: '天然護髮方法大公開，等你頭髮重現光澤...'},
]

export default function Articles() {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#FAF8F5' }}>
      <section style={{ padding: '40px 20px', background: '#A68B6A', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', color: '#fff', fontWeight: 400, letterSpacing: '0.15em' }}>ARTICLES</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '10px' }}>髮型知識</p>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        {ARTICLES.map((article, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '20px', border: '1px solid #E8E0D5' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '40px' }}>{article.emoji}</div>
              <div style={{ flex: 1 }}>
                <span style={{ background: '#A68B6A', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '11px' }}>{article.category}</span>
                <h3 style={{ fontSize: '18px', margin: '12px 0', color: '#3D3D3D' }}>{article.title}</h3>
                <p style={{ color: '#6B6B6B', fontSize: '14px', marginBottom: '12px' }}>{article.excerpt}</p>
                <p style={{ color: '#8A8A8A', fontSize: '12px' }}>{article.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
