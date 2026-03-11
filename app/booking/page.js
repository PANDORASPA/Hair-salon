'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function Booking() {
  const [services, setServices] = useState([])
  const [allServices, setAllServices] = useState([]) // All services for display
  const [coupons, setCoupons] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [formData, setFormData] = useState({ name: '', phone: '', coupon: '' })
  const [bookingRef, setBookingRef] = useState('')
  const [staffList, setStaffList] = useState([])
  const [selectedStaff, setSelectedStaff] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch services, coupons and staff from Supabase
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [servicesData, couponsData, staffData] = await Promise.all([
        supabase.from('services').select('*').eq('enabled', true).order('sort_order'),
        supabase.from('coupons').select('*').eq('enabled', true),
        supabase.from('staff').select('*').eq('enabled', true).order('name')
      ])
      
      if (servicesData.data) {
        // Store all services
        const allSvcs = servicesData.data.map(s => ({
          id: s.id,
          name: s.name,
          price: s.price,
          time: s.time ? `${s.time}分` : '60分',
          timeMins: s.time || 60,
          emoji: s.emoji || getServiceEmoji(s.name),
          serviceIds: [s.id] // For matching with staff services
        }))
        setAllServices(allSvcs)
        setServices(allSvcs) // Initially show all services
      }
      
      if (couponsData.data) {
        const mappedCoupons = couponsData.data.map(c => ({
          id: c.id,
          code: c.code,
          name: c.name,
          discount: c.discount,
          desc: c.type === 'percent' ? `${c.discount}折` : `減$${c.discount}`
        }))
        setCoupons(mappedCoupons)
      }
      
      if (staffData.data) setStaffList(staffData.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  // When staff is selected, filter services they can provide
  useEffect(() => {
    if (!selectedStaff) {
      // No staff selected, show all services
      setServices(allServices)
    } else {
      // Filter services based on staff's allowed services
      const staff = staffList.find(s => s.id.toString() === selectedStaff)
      if (staff && staff.services && staff.services.length > 0) {
        const allowedServiceIds = staff.services
        const filtered = allServices.filter(s => 
          allowedServiceIds.includes(s.id) || allowedServiceIds.includes(s.serviceIds?.[0])
        )
        setServices(filtered.length > 0 ? filtered : allServices)
      } else {
        // Staff has no service restrictions, show all
        setServices(allServices)
      }
    }
    // Reset selected service when staff changes
    setSelectedService(null)
  }, [selectedStaff, staffList])

  const getServiceEmoji = (name) => {
    if (name.includes('剪')) return '✂️'
    if (name.includes('染')) return '🎨'
    if (name.includes('燙')) return '💇'
    if (name.includes('護')) return '💆'
    if (name.includes('头皮')) return '🧴'
    return '✂️'
  }

  // Format date key for schedule lookup
  const formatDateKey = (day, year, month) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  // Check if staff is working on selected date
  const isStaffWorking = (staff, date, time) => {
    if (!staff) return false
    if (!staff.schedule) return true // No schedule = available
    
    // Get day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = new Date(currentYear, currentMonth, date).getDay().toString()
    
    // Check if it's a weekly day off
    if (staff.daysOff?.includes(dayOfWeek)) return false
    
    // Get weekly schedule for this day of week
    const daySchedule = staff.schedule[dayOfWeek]
    if (!daySchedule?.start || !daySchedule?.end) return false
    
    // Check if time is within working hours
    if (time && (time < daySchedule.start || time > daySchedule.end)) return false
    
    return true
  }

  const availableStaff = staffList.filter(s => isStaffWorking(s, selectedDate, selectedTime))

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

    const ref = 'VIVA' + Date.now().toString().slice(-6)
    
    const booking = {
      ref,
      service: selectedService.name,
      service_price: selectedService.price,
      staff_id: selectedStaff || null,
      staff_name: staffList.find(s => s.id == selectedStaff)?.name || null,
      date: `${selectedDate}/${currentMonth + 1}/${currentYear}`,
      time: selectedTime,
      name: formData.name,
      phone: formData.phone,
      coupon: formData.coupon || null,
      final_price: finalPrice,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()

    if (error) {
      alert('錯誤: ' + JSON.stringify(error))
      return
    }

    alert('預約成功！')
    setBookingRef(ref)
    setShowModal(true)
  }

  const finalPrice = selectedService ? 
    (formData.coupon ? 
      (coupons.find(c => c.code === formData.coupon)?.discount >= 100 ? 
        selectedService.price - (coupons.find(c => c.code === formData.coupon)?.discount || 0) : 
        selectedService.price * (1 - (coupons.find(c => c.code === formData.coupon)?.discount || 0) / 100))
      : selectedService.price) 
    : 0

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>載入中...</p>
      </div>
    )
  }

  return (
    <>
      <section style={{ padding: '30px 16px', minHeight: 'auto', background: '#FAF8F5' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', color: '#3D3D3D' }}>預約<span style={{ color: '#A68B6A' }}>服務</span></h1>
        </div>
      </section>

      <section style={{ padding: '24px 12px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Steps */}
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

          {/* Staff Selection - Show first */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ marginBottom: '10px', fontSize: '15px' }}>選擇髮型師 (可留空隨機安排)</h4>
            {availableStaff.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666', background: '#f5f5f5', borderRadius: '8px' }}>
                該日期沒有髮型師當值，請選擇其他日期
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div
                  onClick={() => setSelectedStaff('')}
                  style={{
                    padding: '14px',
                    background: selectedStaff === '' ? '#A68B6A' : '#fff',
                    color: selectedStaff === '' ? '#fff' : '#333',
                    border: '1px solid ' + (selectedStaff === '' ? '#A68B6A' : '#e5e7eb'),
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: '14px'
                  }}
                >
                  隨機安排
                </div>
                {availableStaff.map(s => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStaff(s.id.toString())}
                    style={{
                      padding: '14px',
                      background: selectedStaff === s.id.toString() ? '#A68B6A' : '#fff',
                      color: selectedStaff === s.id.toString() ? '#fff' : '#333',
                      border: '1px solid ' + (selectedStaff === s.id.toString() ? '#A68B6A' : '#e5e7eb'),
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontSize: '14px'
                    }}
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Service Selection */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>
              {selectedStaff ? `選擇 ${staffList.find(s => s.id.toString() === selectedStaff)?.name} 可提供的服務` : '選擇服務'}
            </h3>
            {services.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>暫時沒有服務</p>
            ) : (
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
                      <span style={{ fontSize: '24px' }}>{service.emoji}</span>
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
            )}
          </div>

          {/* Calendar */}
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

          {/* Time Slots */}
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

          {/* Form */}
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
              提交預約 {finalPrice > 0 && "$" + Math.round(finalPrice)}
            </button>
          </div>
        </div>
      </section>

      {/* Success Modal */}
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
              <p><strong>金額：</strong>${Math.round(finalPrice)}</p>
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
