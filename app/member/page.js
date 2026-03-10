'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Member() {
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [myBookings, setMyBookings] = useState([])
  const router = useRouter()

  useEffect(() => {
    const memberData = localStorage.getItem('VIVA_member')
    if (!memberData) {
      router.push('/login')
      return
    }
    
    const m = JSON.parse(memberData)
    setMember(m)
    
    // Get member's bookings from localStorage
    const allBookings = JSON.parse(localStorage.getItem('VIVA_bookings') || '[]')
    const memberBookings = allBookings.filter(b => b.phone === m.phone)
    setMyBookings(memberBookings.reverse())
    
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('VIVA_member')
    router.push('/login')
  }

  const handleCancelBooking = (bookingId) => {
    if (!confirm('確定要取消呢個預約嗎？')) return
    
    // Remove from all bookings
    const allBookings = JSON.parse(localStorage.getItem('VIVA_bookings') || '[]')
    const updatedBookings = allBookings.filter(b => b.id !== bookingId)
    localStorage.setItem('VIVA_bookings', JSON.stringify(updatedBookings))
    
    // Update local state
    setMyBookings(updatedBookings.filter(b => b.phone === member.phone))
    
    alert('預約已取消')
  }

  // Check birthday
  const isBirthday = () => {
    if (!member?.birthday) return false
    const today = new Date()
    const bday = new Date(member.birthday)
    return today.getMonth() === bday.getMonth() && today.getDate() === bday.getDate()
  }

  // Get member's tickets from localStorage
  const getMemberTickets = () => {
    if (!member) return []
    const members = JSON.parse(localStorage.getItem('VIVA_members') || '[]')
    const currentMember = members.find(m => m.id === member.id)
    return currentMember?.tickets || []
  }

  if (loading) {
    return (
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>載入中...</div>
      </div>
    )
  }

  if (!member) return null

  const myTickets = getMemberTickets()

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#FAF8F5' }}>
      {/* Header */}
      <div style={{ background: '#A68B6A', padding: '30px 20px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: '#fff', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
          👤
        </div>
        <h1 style={{ color: '#fff', fontSize: '24px', marginBottom: '4px' }}>{member.name}</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>{member.phone}</p>
        
        {/* Birthday Banner */}
        {isBirthday() && (
          <div style={{ background: '#FF9800', color: '#fff', padding: '12px', borderRadius: '12px', marginTop: '16px', fontWeight: '600' }}>
            🎂 生日快樂！您有$50生日優惠券！
          </div>
        )}
      </div>

      {/* Points Card */}
      <div style={{ maxWidth: '400px', margin: '-30px auto 20px', padding: '20px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#8A8A8A', marginBottom: '4px' }}>積分</div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#A68B6A' }}>{member.points || 0}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#8A8A8A', marginBottom: '4px' }}>會員等級</div>
            <div style={{ background: 'linear-gradient(135deg, #A68B6A, #8B7355)', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>
              🌟 VIP
            </div>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: '#8A8A8A', marginTop: '12px' }}>消費 $1 = 1 積分</p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <Link href="/booking" style={{ display: 'block', padding: '20px', background: '#fff', borderRadius: '12px', textAlign: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📅</div>
            <div style={{ fontWeight: '600', color: '#3D3D3D' }}>預約服務</div>
          </Link>
          <Link href="/tickets" style={{ display: 'block', padding: '20px', background: '#fff', borderRadius: '12px', textAlign: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎫</div>
            <div style={{ fontWeight: '600', color: '#3D3D3D' }}>購買套票</div>
          </Link>
        </div>

        {/* My Bookings */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>我的預約</h2>
          
          {myBookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myBookings.map(booking => (
                <div key={booking.id} style={{ padding: '16px', background: '#FAF8F5', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{booking.serviceName}</div>
                      <div style={{ fontSize: '13px', color: '#8A8A8A' }}>{booking.date} {booking.time} • {booking.staffName}</div>
                    </div>
                    <span style={{ padding: '4px 10px', background: booking.status === 'confirmed' ? '#E8F5E9' : '#FFF3E0', color: booking.status === 'confirmed' ? '#4CAF50' : '#FF9800', borderRadius: '12px', fontSize: '12px' }}>
                      {booking.status === 'confirmed' ? '已確認' : '待確認'}
                    </span>
                  </div>
                  
                  {booking.status === 'pending' && (
                    <button 
                      onClick={() => handleCancelBooking(booking.id)}
                      style={{ 
                        marginTop: '8px',
                        padding: '8px 16px', 
                        background: '#fff', 
                        border: '1px solid #F44336', 
                        borderRadius: '6px', 
                        color: '#F44336', 
                        fontSize: '12px', 
                        cursor: 'pointer' 
                      }}
                    >
                      取消預約
                    </button>
                  )}
                  
                  <div style={{ fontSize: '11px', color: '#8A8A8A', marginTop: '8px' }}>
                    預約編號: {booking.id}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#8A8A8A', textAlign: 'center', padding: '20px' }}>暫時未有預約</p>
          )}
          
          <Link href="/booking" style={{ display: 'block', textAlign: 'center', marginTop: '16px', padding: '12px', background: '#FAF8F5', borderRadius: '8px', color: '#A68B6A', textDecoration: 'none', fontWeight: '500' }}>
            + 新增預約
          </Link>
        </div>

        {/* My Tickets */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>我的套票</h2>
          
          {myTickets.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myTickets.map((ticket, i) => (
                <div key={i} style={{ padding: '16px', background: '#FAF8F5', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontWeight: '600' }}>{ticket.name}</div>
                    <span style={{ background: '#A68B6A', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' }}>
                      剩餘 {ticket.remaining} 次
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#8A8A8A' }}>
                    購買日期: {new Date(ticket.purchaseDate).toLocaleDateString('zh-HK')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#8A8A8A', textAlign: 'center', padding: '20px' }}>暫時未有套票</p>
          )}
          
          <Link href="/tickets" style={{ display: 'block', textAlign: 'center', marginTop: '16px', padding: '12px', background: '#FAF8F5', borderRadius: '8px', color: '#A68B6A', textDecoration: 'none', fontWeight: '500' }}>
            + 購買套票
          </Link>
        </div>

        {/* Member Info */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>會員資料</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#FAF8F5', borderRadius: '8px' }}>
              <span style={{ color: '#8A8A8A' }}>姓名</span>
              <span style={{ fontWeight: '500' }}>{member.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#FAF8F5', borderRadius: '8px' }}>
              <span style={{ color: '#8A8A8A' }}>電話</span>
              <span style={{ fontWeight: '500' }}>{member.phone}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#FAF8F5', borderRadius: '8px' }}>
              <span style={{ color: '#8A8A8A' }}>生日</span>
              <span style={{ fontWeight: '500' }}>{member.birthday || '未設置'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#FAF8F5', borderRadius: '8px' }}>
              <span style={{ color: '#8A8A8A' }}>註冊日期</span>
              <span style={{ fontWeight: '500' }}>{member.createdAt ? new Date(member.createdAt).toLocaleDateString('zh-HK') : '未知'}</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{ width: '100%', padding: '16px', background: '#fff', border: '1px solid #E8E0D5', borderRadius: '12px', color: '#F44336', fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginBottom: '40px' }}>
          登出
        </button>

      </div>
    </div>
  )
}
