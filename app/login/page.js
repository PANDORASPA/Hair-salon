'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    
    setTimeout(() => {
      setLoading(false)
      alert(isLogin ? '登入成功！' : '註冊成功，歡迎加入 VIVA HAIR！')
    }, 1000)
  }

  return (
    <>
      <section style={{ padding: '40px 0', background: '#FAF8F5' }}>
        <div className="container">
          <h1 style={{ fontSize: '32px', textAlign: 'center' }}>{isLogin ? '登入' : '註冊'}<span style={{ color: '#A68B6A' }}>帳戶</span></h1>
        </div>
      </section>

      <section className="section">
        <div style={{ 
          maxWidth: '450px', 
          margin: '0 auto', 
          background: '#fff', 
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div style={{ 
            display: 'flex', 
            marginBottom: '30px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #ddd'
          }}>
            <button
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1,
                padding: '12px',
                background: isLogin ? '#A68B6A' : '#fff',
                color: isLogin ? '#fff' : '#666',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              登入
            </button>
            <button
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1,
                padding: '12px',
                background: !isLogin ? '#A68B6A' : '#fff',
                color: !isLogin ? '#fff' : '#666',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              註冊
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>
                  姓名
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  placeholder="請輸入您的姓名"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>
                電話
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required={!isLogin}
                placeholder="請輸入電話號碼"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>
                電郵
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="請輸入電郵地址"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>
                密碼
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="請輸入密碼"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            {isLogin && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  <input type="checkbox" /> 記住登入
                </label>
                <a href="#" style={{ color: '#A68B6A' }}>忘記密碼？</a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: '#A68B6A',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 600,
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? '處理中...' : (isLogin ? '登入' : '註冊')}
            </button>
          </form>

          <div style={{ marginTop: '30px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '20px' 
            }}>
              <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
              <span style={{ padding: '0 15px', color: '#999', fontSize: '14px' }}>或</span>
              <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
            </div>

            <button
              style={{
                width: '100%',
                padding: '12px',
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '10px'
              }}
            >
              📱 使用電話號碼登入
            </button>

            <button
              style={{
                width: '100%',
                padding: '12px',
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              💬 WeChat 登入
            </button>
          </div>

          {!isLogin && (
            <p style={{ 
              marginTop: '20px', 
              fontSize: '12px', 
              color: '#999',
              textAlign: 'center',
              lineHeight: 1.6
            }}>
              註冊即表示同意我哋既
              <a href="#" style={{ color: '#A68B6A' }}> 服務條款</a>同
              <a href="#" style={{ color: '#A68B6A' }}> 隱私政策</a>
            </p>
          )}
        </div>

        <div style={{ 
          maxWidth: '450px', 
          margin: '40px auto',
          textAlign: 'center' 
        }}>
          <h3 style={{ marginBottom: '20px' }}>會員專享</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            <div style={{ 
              background: '#fff', 
              padding: '20px', 
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>🎫</div>
              <div style={{ fontWeight: 600, marginBottom: '5px' }}>套票9折</div>
              <div style={{ fontSize: '12px', color: '#666' }}>購買套票優惠</div>
            </div>
            <div style={{ 
              background: '#fff', 
              padding: '20px', 
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>🎁</div>
              <div style={{ fontWeight: 600, marginBottom: '5px' }}>積分換禮</div>
              <div style={{ fontSize: '12px', color: '#666' }}>積分換產品</div>
            </div>
            <div style={{ 
              background: '#fff', 
              padding: '20px', 
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>📅</div>
              <div style={{ fontWeight: 600, marginBottom: '5px' }}>優先預約</div>
              <div style={{ fontSize: '12px', color: '#666' }}>搶先預約心水時段</div>
            </div>
            <div style={{ 
              background: '#fff', 
              padding: '20px', 
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>💰</div>
              <div style={{ fontWeight: 600, marginBottom: '5px' }}>產品9折</div>
              <div style={{ fontSize: '12px', color: '#666' }}>會員專享優惠</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
