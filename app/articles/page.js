export default function Articles() {
  const articles = [
    { id: 1, title: '如何選擇適合自己的髮型？', category: '髮型貼士', date: '2026-03-01', excerpt: '根據臉型、髮質同埋個人風格嚟選擇最適合既髮型...' },
    { id: 2, title: '護髮小知識 - 你要知既5件事', category: '護髮知識', date: '2026-02-25', excerpt: '日常護髮既錯誤示範同正確方法...' },
    { id: 3, title: '脫髮原因同改善方法', category: '头皮護理', date: '2026-02-20', excerpt: '點解會甩頭髮？等我哋教你點樣改善...' },
  ]

  return (
    <>
      <section style={{ padding: '40px 0', background: '#FAF8F5', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', color: '#3D3D3D' }}>文章<span style={{ color: '#A68B6A' }}>分享</span></h1>
      </section>

      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {articles.map(article => (
            <div key={article.id} style={{ background: '#fff', borderRadius: '12px', padding: '25px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '12px', color: '#A68B6A', fontWeight: 600 }}>{article.category}</span>
              <h2 style={{ fontSize: '20px', margin: '10px 0' }}>{article.title}</h2>
              <p style={{ color: '#666', marginBottom: '15px' }}>{article.excerpt}</p>
              <span style={{ fontSize: '12px', color: '#999' }}>{article.date}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
