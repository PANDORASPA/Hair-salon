'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Check if already logged in
  useEffect(() => {
    const member = localStorage.getItem('VIVA_member')
    if (member) {
      router.push('/member')
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    if (isLogin) {
      // Login
      const members = JSON.parse(localStorage.getItem('VIVA_members') || '[]')
      const member = members.find(m => m.phone === phone && m.password === password)
      
      if (member) {
        localStorage.setItem('VIVA_member', JSON.stringify(member))
        router.push('/member')
      } else {
        setError('電話或密碼錯誤')
      }
    } else {
      // Register
      const members = JSON.parse(localStorage.getItem('VIVA_members') || '[]')
      
      if (members.find(m => m.phone === phone)) {
        setError('此電話已經註冊')
        setLoading(false)
        return
      }

      const newMember = {
        id: 'MB' + Date.now().toString().slice(-6),
        name,
        phone,
        birthday,
        password,
        points: 0,
        tickets: [],
        bookings: [],
        createdAt: new Date().toISOString()
      }

      members.push(newMember)
      localStorage.setItem('VIVA_members', JSON.stringify(members))
      localStorage.setItem('VIVA_member', JSON.stringify(newMember))
      router.push('/member')
    }

    setLoading(false)
  }

  const isBirthday = () => {
    if (!birthday) return false
    const today = new Date()
    const bday = new Date(birthday)
    return today.getMonth() === bday.getMonth() && today.getDate() === bday.getDate()
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', border: '1px solid #E8E0D5' }}>
          <h1 style={{ fontSize: '28px', textAlign: 'center', marginBottom: '8px', color: '#3D3D3D' }}>
            VIVA <span style={{ color: '#A68B6A' }}>HAIR</span>
          </h1>
          <p style={{ textAlign: 'center', color: '#8A8A8A', marginBottom: '30px' }}>
            {isLogin ? '會員登入' : '會員註冊'}
          </p>

          {error && (
            <div style={{ background: '#ffebee', color: '#F44336', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6B6B6B' }}>姓名</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="您的姓名"
                  required={!isLogin}
                  style={{ width: '100%', padding: '12px', border: '1px solid #E8E0D5', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>
            )}
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6B6B6B' }}>電話</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9/8/7/6 開頭"
                required
                style={{ width: '100%', padding: '12px', border: '1px solid #E8E0D5', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>

            {!isLogin && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6B6B6B' }}>
                  生日 🎂
                  <span style={{ color: '#8A8A8A', fontSize: '12px', marginLeft: '8px' }}>(獲得生日優惠)</span>
                </label>
                <input 
                  type="date" 
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #E8E0D5', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6B6B6B' }}>密碼</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密碼"
                required
                style={{ width: '100%', padding: '12px', border: '1px solid #E8E0D5', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: '#A68B6A', color: '#fff', border: 'none', borderRadius: '25px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '處理中...' : (isLogin ? '登入' : '註冊')}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6B6B6B' }}>
            {isLogin ? '未有帳戶？' : '已有帳戶？'}
            <span 
              onClick={() => { setIsLogin(!isLogin); setError('') }}
              style={{ color: '#A68B6A', cursor: 'pointer', marginLeft: '8px', fontWeight: '500' }}
            >
              {isLogin ? '立即註冊' : '立即登入'}
            </span>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ color: '#8A8A8A', textDecoration: 'none', fontSize: '14px' }}>
            ← 返回首頁
          </a>
        </p>
      </div>
    </div>
  )
}
