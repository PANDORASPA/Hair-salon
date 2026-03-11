'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    // 檢查是否已登入
    const currentUser = localStorage.getItem('viva_current_user')
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  const handleRegister = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // 模擬網絡延遲
    setTimeout(() => {
      // 獲取現有用戶
      const users = JSON.parse(localStorage.getItem('viva_users') || '[]')
      
      // 檢查email是否已註冊
      if (users.find(u => u.email === email)) {
        setError('此電郵已註冊，請直接登入')
        setLoading(false)
        return
      }

      // 檢查電話是否已註冊
      if (users.find(u => u.phone === phone)) {
        setError('此電話號碼已註冊')
        setLoading(false)
        return
      }

      // 創建新用戶
      const newUser = {
        id: Date.now(),
        name,
        phone,
        email,
        password,
        points: 100, // 新用戶送100積分
        createdAt: new Date().toISOString()
      }

      users.push(newUser)
      localStorage.setItem('viva_users', JSON.stringify(users))

      // 自動登入
      localStorage.setItem('viva_current_user', JSON.stringify(newUser))
      setUser(newUser)
      setSuccess('註冊成功！歡迎加入 VIVA HAIR！')
      setLoading(false)
    }, 1000)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('viva_users') || '[]')
      const foundUser = users.find(u => u.email === email && u.password === password)

      if (foundUser) {
        localStorage.setItem('viva_current_user', JSON.stringify(foundUser))
        setUser(foundUser)
        setSuccess('登入成功！')
      } else {
        setError('電郵或密碼錯誤，請重試')
      }
      setLoading(false)
    }, 1000)
  }

  const handleLogout = () => {
    localStorage.removeItem('viva_current_user')
    setUser(null)
    setEmail('')
    setPassword('')
    setName('')
    setPhone('')
    window.location.href = '/'
  }

  const handleSubmit = (e) => {
    if (isLogin) {
      handleLogin(e)
    } else {
      handleRegister(e)
    }
  }

  // 已登入顯示
  if (user) {
    return (
      <>
        <section style={{ padding: '40px 0', background: '#FAF8F5' }}>
          <div style={{ maxWidth: '450px', margin: '0 auto', padding: '0 20px' }}>
            <h1 style={{ fontSize: '32px', textAlign: 'center' }}>會員<span style={{ color: '#A68B6A' }}>中心</span></h1>
          </div>
        </section>

        <section style={{ padding: '40px 20px' }}>
          <div style={{ maxWidth: '450px', margin: '0 auto' }}>
            {/* 用戶卡片 */}
            <div style={{ 
              background: '#fff', 
              borderRadius: '16px', 
              padding: '30px',
              boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #A68B6A, #8B7355)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  color: '#fff',
                  margin: '0 auto 15px'
                }}>
                  {user.name.charAt(0)}
                </div>
                <h2 style={{ marginBottom: '5px' }}>{user.name}</h2>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>{user.email}</p>
                <div style={{ 
                  display: 'inline-block', 
                  padding: '8px 20px', 
                  background: '#A68B6A', 
                  color: '#fff', 
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  💎 {user.points || 0} 積分
                </div>
              </div>
            </div>

            {/* 功能選單 */}
            <div style={{ 
              background: '#fff', 
              borderRadius: '16px', 
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <Link href="/booking" style={{ display: 'block', padding: '20px', borderBottom: '1px solid #f0f0f0', textDecoration: 'none', color: '#333' }}>
                📅 我的預約
              </Link>
              <Link href="/tickets" style={{ display: 'block', padding: '20px', borderBottom: '1px solid #f0f0f0', textDecoration: 'none', color: '#333' }}>
                🎫 我的套票
              </Link>
              <Link href="/products" style={{ display: 'block', padding: '20px', borderBottom: '1px solid #f0f0f0', textDecoration: 'none', color: '#333' }}>
                🛍️ 產品商店
              </Link>
              <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
                🎁 積分記錄
              </div>
              <div style={{ padding: '20px' }}>
                ⚙️ 帳戶設定
              </div>
            </div>

            <button 
              onClick={handleLogout}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '14px',
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                color: '#666'
              }}
            >
              登出
            </button>
          </div>
        </section>
      </>
    )
  }

  // 登入/註冊表單
  return (
    <>
      <section style={{ padding: '40px 0', background: '#FAF8F5' }}>
        <div style={{ maxWidth: '450px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '32px', textAlign: 'center' }}>{isLogin ? '登入' : '註冊'}<span style={{ color: '#A68B6A' }}>帳戶</span></h1>
        </div>
      </section>

      <section style={{ padding: '40px 20px' }}>
        <div style={{ 
          maxWidth: '450px', 
          margin: '0 auto', 
          background: '#fff', 
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          {/* 成功訊息 */}
          {success && (
            <div style={{ 
              padding: '15px', 
              background: '#dcfce7', 
              color: '#16a34a', 
              borderRadius: '8px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {success}
            </div>
          )}

          {/* 錯誤訊息 */}
          {error && (
            <div style={{ 
              padding: '15px', 
              background: '#fee2e2', 
              color: '#dc2626', 
              borderRadius: '8px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Toggle */}
          <div style={{ 
            display: 'flex', 
            marginBottom: '30px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #ddd'
          }}>
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccess('') }}
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
              onClick={() => { setIsLogin(false); setError(''); setSuccess('') }}
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
                  姓名 *
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
                電話 *
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
                電郵 *
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
                密碼 *
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

        {/* 會員專享 */}
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
