'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Booking() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [remark, setRemark] = useState('')
  const [availableTimes, setAvailableTimes] = useState([])
  const [loading, setLoading] = useState(false)
  const [member, setMember] = useState(null)
  const router = useRouter()

  // Services data
  const services = [
    { id: 'cut', name: '剪髮', price: 280, duration: 60, emoji: '✂️' },
    { id: 'color', name: '染髮', price: 680, duration: 120, emoji: '🎨' },
    { id: 'perm', name: '燙髮', price: 880, duration: 150, emoji: '💇' },
    { id: 'treatment', name: '護髮', price: 380, duration: 60, emoji: '🧴' },
    { id: 'styling', name: '造型', price: 180, duration: 30, emoji: '✨' },
    { id: 'bridal', name: '新娘造型', price: 1280, duration: 180, emoji: '👰' },
  ]

  const staff = [
    { id: 'mark', name: 'Mark', title: '創意總監', emoji: '👨‍💼' },
    { id: 'sophia', name: 'Sophia', title: '高級髮型師', emoji: '👩‍💼' },
    { id: 'jack', name: 'Jack', title: '資深髮型師', emoji: '👨‍💇' },
    { id: 'lily', name: 'Lily', title: '髮型師', emoji: '👩‍💇' },
  ]

  useEffect(() => {
    const memberData = localStorage.getItem('VIVA_member')
    if (memberData) {
      const m = JSON.parse(memberData)
      setMember(m)
      setName(m.name || '')
      setPhone(m.phone || '')
    }
  }, [])

  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const day = date.getDay()
      if (day !== 0) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: `${date.getMonth() + 1}/${date.getDate()} ${['日', '一', '二', '三', '四', '五', '六'][day]}`
        })
      }
    }
    return dates
  }

  useEffect(() => {
    if (!selectedStaff || !selectedDate) {
      setAvailableTimes([])
      return
    }

    const date = new Date(selectedDate)
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const dayName = days[date.getDay()]
    
    const staffMember = staff.find(s => s.id === selectedStaff)
    if (!staffMember) {
      setAvailableTimes([])
      return
    }

    const schedule = {
      mark: { mon: ['10-13','14-19'], tue: ['10-13','14-19'], wed: ['10-13','14-19'], thu: ['10-13','14-19'], fri: ['10-13','14-19'], sat: ['10-13','14-19'], sun: [] },
      sophia: { mon: [], tue: ['11-14','15-20'], wed: [], thu: ['11-14','15-20'], fri: ['11-14','15-20'], sat: ['11-14','15-20'], sun: ['11-14','15-20'] },
      jack: { mon: ['10-13','14-18'], tue: ['10-13','14-18'], wed: ['10-13','14-18'], thu: ['10-13','14-18'], fri: [], sat: ['10-13','14-18'], sun: [] },
      lily: { mon: ['12-15','16-21'], tue: ['12-15','16-21'], wed: ['12-15','16-21'], thu: ['12-15','16-21'], fri: ['12-15','16-21'], sat: [], sun: ['12-15','16-21'] },
    }

    const staffSchedule = schedule[selectedStaff]
    if (!staffSchedule || !staffSchedule[dayName] || staffSchedule[dayName].length === 0) {
      setAvailableTimes([])
      return
    }

    const slots = []
    staffSchedule[dayName].forEach(timeRange => {
      const [start, end] = timeRange.split('-')
      for (let h = parseInt(start); h < parseInt(end); h++) {
        slots.push(`${h.toString().padStart(2, '0')}:00`)
      }
    })

    setAvailableTimes(slots)
  }, [selectedStaff, selectedDate])

  const availableDates = getAvailableDates()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    await new Promise(resolve => setTimeout(resolve, 500))

    const booking = {
      id: 'BK' + Date.now().toString().slice(-6),
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      staffId: selectedStaff,
      staffName: staff.find(s => s.id === selectedStaff)?.name,
      date: selectedDate,
      time: selectedTime,
      name,
      phone,
      remark,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    const bookings = JSON.parse(localStorage.getItem('VIVA_bookings') || '[]')
    bookings.push(booking)
    localStorage.setItem('VIVA_bookings', JSON.stringify(bookings))

    setLoading(false)
    alert(`預約成功！\n\n編號：${booking.id}\n服務：${booking.serviceName}\n髮型師：${booking.staffName}\n日期：${booking.date} ${booking.time}`)
    router.push('/member')
  }

  const isStepComplete = (stepNum) => {
    switch(stepNum) {
      case 1: return selectedService !== null
      case 2: return selectedStaff !== null
      case 3: return selectedDate !== '' && selectedTime !== ''
      case 4: return name !== '' && phone !== ''
      default: return false
    }
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#FAF8F5' }}>
      <section style={{ padding: '30px 16px', background: '#A68B6A', textAlign: 'center' }}>
        <h1 style={{ fontSize: '26px', color: '#fff', fontWeight: 400, letterSpacing: '0.12em' }}>BOOKING</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '8px', fontSize: '14px' }}>預約您的完美造型</p>
      </section>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px' }}>
        
        {/* Steps - Mobile Friendly */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', gap: '8px' }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: isStepComplete(s) ? '#4CAF50' : (step >= s ? '#A68B6A' : '#E8E0D5'), 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '13px', 
                fontWeight: '600',
                margin: '0 auto 6px'
              }}>
                {isStepComplete(s) ? '✓' : s}
              </div>
              <span style={{ fontSize: '11px', color: step >= s ? '#A68B6A' : '#8A8A8A' }}>
                {s === 1 ? '服務' : s === 2 ? '髮型師' : s === 3 ? '時間' : '資料'}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '16px', padding: '20px' }}>
          
          {/* Step 1: Service - Mobile Grid */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '14px', color: '#3D3D3D' }}>1. 選擇服務</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {services.map(service => (
                <div 
                  key={service.id}
                  onClick={() => { setSelectedService(service); setStep(2) }}
                  style={{ 
                    padding: '14px', 
                    border: `2px solid ${selectedService?.id === service.id ? '#A68B6A' : '#E8E0D5'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: selectedService?.id === service.id ? '#FAF8F5' : '#fff',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{service.emoji}</div>
                  <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '2px' }}>{service.name}</div>
                  <div style={{ color: '#A68B6A', fontWeight: '600', fontSize: '14px' }}>${service.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Staff - Mobile Grid */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '14px', color: '#3D3D3D' }}>2. 選擇髮型師</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {staff.map(s => (
                <div 
                  key={s.id}
                  onClick={() => { setSelectedStaff(s.id); setStep(3); setSelectedDate(''); setSelectedTime('') }}
                  style={{ 
                    padding: '16px', 
                    border: `2px solid ${selectedStaff === s.id ? '#A68B6A' : '#E8E0D5'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: selectedStaff === s.id ? '#FAF8F5' : '#fff',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '4px' }}>{s.emoji}</div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{s.name}</div>
                  <div style={{ fontSize: '11px', color: '#8A8A8A' }}>{s.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Date & Time */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '14px', color: '#3D3D3D' }}>3. 選擇日期和時間</h3>
            
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#6B6B6B' }}>選擇日期</label>
              <select 
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime('') }}
                style={{ width: '100%', padding: '14px', border: '1px solid #E8E0D5', borderRadius: '12px', fontSize: '15px' }}
              >
                <option value="">選擇日期</option>
                {availableDates.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            {selectedDate && (
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#6B6B6B' }}>選擇時間</label>
                {availableTimes.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {availableTimes.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { setSelectedTime(t); setStep(4) }}
                        style={{ 
                          padding: '12px', 
                          background: selectedTime === t ? '#A68B6A' : '#fff',
                          color: selectedTime === t ? '#fff' : '#3D3D3D',
                          border: `1px solid ${selectedTime === t ? '#A68B6A' : '#E8E0D5'}`,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center', background: '#FFF3E0', borderRadius: '10px', color: '#FF9800', fontSize: '14px' }}>
                    呢日冇得預約，請選擇其他日期
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 4: Contact Info */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '14px', color: '#3D3D3D' }}>4. 聯絡資料</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#6B6B6B' }}>姓名 *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="您的姓名" required style={{ width: '100%', padding: '14px', border: '1px solid #E8E0D5', borderRadius: '12px', fontSize: '15px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#6B6B6B' }}>電話 *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9/8/7/6 開頭" required style={{ width: '100%', padding: '14px', border: '1px solid #E8E0D5', borderRadius: '12px', fontSize: '15px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#6B6B6B' }}>備註</label>
                <textarea value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="有咩想我哋知？" rows={2} style={{ width: '100%', padding: '14px', border: '1px solid #E8E0D5', borderRadius: '12px', fontSize: '15px', resize: 'none' }} />
              </div>
            </div>
          </div>

          {/* Summary */}
          {selectedService && selectedDate && selectedTime && (
            <div style={{ background: '#FAF8F5', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px', color: '#3D3D3D', fontSize: '14px' }}>預約摘要</h4>
              <div style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#6B6B6B' }}>
                <div>服務：{selectedService.name} - ${selectedService.price}</div>
                <div>髮型師：{staff.find(s => s.id === selectedStaff)?.name}</div>
                <div>日期：{selectedDate} {selectedTime}</div>
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={!selectedService || !selectedDate || !selectedTime || !name || !phone || loading}
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: selectedService && selectedDate && selectedTime && name && phone && !loading ? '#A68B6A' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: selectedService && selectedDate && selectedTime && name && phone && !loading ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? '處理中...' : '確認預約'}
          </button>
        </form>
      </div>
    </div>
  )
}
