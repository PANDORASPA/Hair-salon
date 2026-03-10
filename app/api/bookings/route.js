/**
 * 預約 API
 * GET /api/bookings - 獲取預約列表
 * POST /api/bookings - 創建預約
 * GET /api/bookings/[id] - 獲取單個預約
 * PUT /api/bookings/[id] - 更新預約
 * DELETE /api/bookings/[id] - 取消預約
 */

import { NextResponse } from 'next/server'

// Mock 數據庫
const bookings = new Map()
let bookingIdCounter = 1

// 服務數據
const services = [
  { id: '1', name: 'DS100 爆毛術', category: 'hair', price: 800, duration: 45 },
  { id: '2', name: '針對性頭髮Facial', category: 'scalp', price: 600, duration: 30 },
  { id: '3', name: 'DJ TOKIO 京喚羽', category: 'hair', price: 700, duration: 40 },
]

// 套票數據
const tickets = [
  { id: '1', name: 'DS100 12次套票', times: 12, price: 10800 },
  { id: '2', name: 'DS100 6次套票', times: 6, price: 5760 },
]

// 獲取預約列表
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')
  const date = searchParams.get('date')
  const status = searchParams.get('status')
  
  let result = Array.from(bookings.values())
  
  // 過濾
  if (userId) {
    result = result.filter(b => b.user_id === userId)
  }
  if (date) {
    result = result.filter(b => b.date === date)
  }
  if (status) {
    result = result.filter(b => b.status === status)
  }
  
  // 排序
  result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  
  // 填充服務/套票信息
  result = result.map(booking => {
    const service = services.find(s => s.id === booking.service_id)
    const ticket = tickets.find(t => t.id === booking.ticket_id)
    return {
      ...booking,
      service: service || null,
      ticket: ticket || null
    }
  })
  
  return NextResponse.json(result)
}

// 創建預約
export async function POST(request) {
  try {
    const data = await request.json()
    const { user_id, service_id, ticket_id, date, time, notes } = data
    
    // 驗證
    if (!date || !time) {
      return NextResponse.json({ error: '請選擇日期和時間' }, { status: 400 })
    }
    
    if (!service_id && !ticket_id) {
      return NextResponse.json({ error: '請選擇服務或套票' }, { status: 400 })
    }
    
    // 計算金額
    let total_amount = 0
    let service = null
    
    if (service_id) {
      service = services.find(s => s.id === service_id)
      if (service) {
        total_amount = service.price
      }
    } else if (ticket_id) {
      const ticket = tickets.find(t => t.id === ticket_id)
      if (ticket) {
        total_amount = ticket.price
      }
    }
    
    // 創建預約
    const booking = {
      id: (bookingIdCounter++).toString(),
      user_id,
      service_id,
      ticket_id,
      date,
      time,
      notes: notes || '',
      status: 'pending',
      total_amount,
      payment_status: 'unpaid',
      created_at: new Date().toISOString()
    }
    
    bookings.set(booking.id, booking)
    
    return NextResponse.json({
      success: true,
      booking
    })
    
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: '創建預約失敗' }, { status: 500 })
  }
}


