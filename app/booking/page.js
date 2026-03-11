'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

const services = [
  { id: 1, name: '剪髮', price: 280, time: '60分', img: '✂️' },
  { id: 2, name: '染髮', price: 680, time: '120分', img: '🎨' },
  { id: 3, name: '燙髮', price: 880, time: '150分', img: '💇' },
  { id: 4, name: '護髮', price: 380, time: '60分', img: '💆' },
  { id: 5, name: '头皮护理', price: 450, time: '45分', img: '🧴' },
]

const coupons = [
  { id: 1, name: '新客8折', discount: 20, code: 'NEW20', desc: '首次預約8折' },
  { id: 2, name: '節省$100', discount: 100, code: 'SAVE100', desc: '滿$500減$100' },
]

export default function Booking() {
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [formData, setFormData] = useState({ name: '', phone: '', coupon: '' })
  const [bookingRef, setBookingRef] = useState('')

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

  const renderCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const today = new Date()
    
    let days = []
    for (let i = 0; i < firstDay; i++) days.push(<div key={'empty-' + i}></div>)
    
    for (let d = 1; d <= daysInMonth; d++) {
      const isPast = currentYear < today.getFullYear() || 
        (currentYear === today.getFullYear() && currentMonth < today.getMonth()) ||
        (currentYear === today.getFullYear() && currentMonth === today.getMonth() && d < today.getDate())
      const isSelected = selectedDate === d
      
      days.push(
        <div
          key={d}
          onClick={() => !isPast && setSelectedDate(d)}
          style={{
            cursor: isPast ? 'not-allowed' : 'pointer',
            opacity: isPast ? 0.3 : 1,
            background: isSelected ? '#A68B6A' : 'transparent',
            color: isSelected ? '#fff' : '#333',
            padding: '10px',
            textAlign: 'center',
            borderRadius: '8px'
          }}
        >
          {d}
        </div>
      )
    }
    return days
  }

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !formData.name || !formData.phone) {
      alert('請填寫所有必填項目')
      return
    }

    // 生成預約編號
    const ref = 'VIVA' + Date.now().toString().slice(-6)
    
    // 建立預約資料
    const booking = {
      ref,
      service: selectedService.name,
      service_price: selectedService.price,
      date: `${selectedDate}/${currentMonth + 1}/${currentYear}`,
      time: selectedTime,
      name: formData.name,
      phone: formData.phone,
      coupon: formData.coupon || null,
      final_price: finalPrice,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    // 儲存到 Supabase
    const { error } = await supabase
      .from('bookings')
      .insert([booking])

    if (error) {
      console.error('Error saving booking:', error)
      alert('預約失敗，請稍後再試')
      return
    }

    // 顯示成功
    setBookingRef(ref)
    setShowModal(true)
  }

  const finalPrice = selectedService ? 
    (formData.coupon ? 
      (coupons.find(c => c.code === formData.coupon)?.discount === 100 ? 
        selectedService.price - 100 : 
        selectedService.price * 0.8)
      : selectedService.price) 
    : 0

  return (
    <>
      <section style={{ padding: '30px 16px', minHeight: 'auto', background: '#FAF8F5' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', color: '#3D3D3D' }}>預約<span style={{ color: '#A68B6A' }}>服務</span></h1>
        </div>
      </section>

      <section style={{ padding: '24px 12px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Steps - Mobile Friendly */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ padding: '8px 12px', borderRadius: '8px', background: selectedService ? '#A68B6A' : '#e5e7eb', color: selectedService ? '#fff' : '#999', fontSize: '12px', minWidth: '80px', textAlign: 'center' }}>
              選擇服務
            </div>
            <div style={{ padding: '8px 12px', borderRadius: '8px', background: selectedDate && selectedTime ? '#A68B6A' : '#e5e7eb', color: selectedDate && selectedTime ? '#fff' : '#999', fontSize: '12px', minWidth: '80px', textAlign: 'center' }}>
              選擇時間
            </div>
            <div style={{ padding: '8px 12px', borderRadius: '8px', background: formData.name && formData.phone ? '#A68B6A' : '#e5e7eb', color: formData.name && formData.phone ? '#fff' : '#999', fontSize: '12px', minWidth: '80px', textAlign: 'center' }}>
              填寫資料
            </div>
          </div>

          {/* Service Selection - Mobile Optimized */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>選擇服務</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              {services.map(service => (
                <div 
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  style={{ 
                    padding: '14px', 
                    border: '2px solid ' + (selectedService?.id === service.id ? '#A68B6A' : '#e5e7eb'),
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: selectedService?.id === service.id ? '#FAF8F5' : 'transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: '60px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{service.img}</span>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '15px' }}>{service.name}</span>
                      <span style={{ color: '#666', marginLeft: '8px', fontSize: '13px' }}>{service.time}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#A68B6A' }}>${service.price}</span>
                    {selectedService?.id === service.id && <span style={{ color: '#A68B6A', fontSize: '18px' }}>✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar - Mobile Optimized */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <button onClick={() => { setCurrentMonth(m => m === 0 ? 11 : m - 1); if (currentMonth === 0) setCurrentYear(y => y - 1) }} style={{ padding: '10px 14px', background: '#fff', border: '2px solid #A68B6A', color: '#A68B6A', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>◀</button>
              <h3 style={{ fontSize: '16px' }}>{currentYear}年{currentMonth + 1}月</h3>
              <button onClick={() => { setCurrentMonth(m => m === 11 ? 0 : m + 1); if (currentMonth === 11) setCurrentYear(y => y + 1) }} style={{ padding: '10px 14px', background: '#fff', border: '2px solid #A68B6A', color: '#A68B6A', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>▶</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontWeight: 600, color: '#666', padding: '8px', fontSize: '12px' }}>{d}</div>
              ))}
              {renderCalendar()}
            </div>
          </div>

          {/* Time Slots - Mobile Optimized */}
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ marginBottom: '10px', fontSize: '15px' }}>選擇時間</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {timeSlots.map(time => (
                <div
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  style={{
                    padding: '14px',
                    background: selectedTime === time ? '#A68B6A' : '#fff',
                    color: selectedTime === time ? '#fff' : '#333',
                    border: '1px solid ' + (selectedTime === time ? '#A68B6A' : '#e5e7eb'),
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: '15px',
                    fontWeight: 500,
                    minHeight: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>

          {/* Form - Mobile Optimized */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', marginTop: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>客戶資料</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>姓名 *</label>
              <input type="text" placeholder="請輸入您的姓名" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '16px' }} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>電話 *</label>
              <input type="tel" placeholder="請輸入您的電話號碼" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '16px' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>優惠碼</label>
              <select value={formData.coupon} onChange={e => setFormData({...formData, coupon: e.target.value})} style={{ width: '100%', padding: '14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '16px' }}>
                <option value="">請選擇優惠碼</option>
                {coupons.map(c => (
                  <option key={c.code} value={c.code}>{c.name} - {c.desc}</option>
                ))}
              </select>
            </div>
            <button onClick={handleSubmit} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #A68B6A, #8B7355)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '16px', cursor: 'pointer', minHeight: '52px' }}>
              提交預約 {finalPrice > 0 && "$" + finalPrice}
            </button>
          </div>
        </div>
      </section>

      {/* Success Modal - Mobile Optimized */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 300, padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '400px', width: '100%', textAlign: 'center', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ color: '#A68B6A', marginBottom: '10px' }}>預約成功！</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>預約編號：<strong>{bookingRef}</strong></p>
            <div style={{ background: '#FAF8F5', padding: '15px', borderRadius: '8px', marginBottom: '15px', textAlign: 'left' }}>
              <p><strong>服務：</strong>{selectedService?.name}</p>
              <p><strong>日期：</strong>{selectedDate}/{currentMonth + 1}/{currentYear}</p>
              <p><strong>時間：</strong>{selectedTime}</p>
              <p><strong>金額：</strong>${finalPrice}</p>
            </div>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              我們會盡快確認您的預約，並發送確認訊息到您的電話。
            </p>
            <Link href="/" style={{ display: 'block', padding: '12px 30px', background: 'linear-gradient(135deg, #A68B6A, #8B7355)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>
              返回首頁
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
