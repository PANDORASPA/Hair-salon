/**
 * 通知 API
 * POST /api/notifications/send - 發送通知
 * GET /api/notifications - 獲取通知列表
 * PUT /api/notifications/[id] - 標記為已讀
 */

import { NextResponse } from 'next/server'

// Nodemailer 配置 (實際使用時填入)
const nodemailer = require('nodemailer')

// Twilio 配置 (實際使用時填入)
// const twilio = require('twilio')(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// )

// Mock 通知數據庫
const notifications = new Map()
let notificationIdCounter = 1

// Email 發送函數
const sendEmail = async (to, subject, html) => {
  // 實際發送時使用
  /*
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
  
  await transporter.sendMail({
    from: '"Pandora 爆毛秘店" <noreply@pandora.hk>',
    to,
    subject,
    html
  })
  */
  
  console.log('?? Email sent to:', to, 'Subject:', subject)
  return { success: true }
}

// SMS 發送函數
const sendSMS = async (to, message) => {
  // 實際發送時使用
  /*
  await twilio.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to
  })
  */
  
  console.log('?? SMS sent to:', to, 'Message:', message)
  return { success: true }
}

// 發送通知
export async function POST(request) {
  try {
    const data = await request.json()
    const { type, user_id, user_email, user_phone, title, content, method } = data
    
    // 創建通知記錄
    const notification = {
      id: (notificationIdCounter++).toString(),
      user_id,
      title,
      content,
      type: type || 'system',
      read: false,
      created_at: new Date().toISOString()
    }
    
    notifications.set(notification.id, notification)
    
    // 發送通知
    if (method === 'email' || method === 'all') {
      if (user_email) {
        await sendEmail(user_email, title, content)
      }
    }
    
    if (method === 'sms' || method === 'all') {
      if (user_phone) {
        await sendSMS(user_phone, `${title}\n${content}`)
      }
    }
    
    return NextResponse.json({
      success: true,
      notification
    })
    
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json({ error: '發送通知失敗' }, { status: 500 })
  }
}

// 獲取通知列表
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')
  const unread = searchParams.get('unread')
  
  let result = Array.from(notifications.values())
  
  if (userId) {
    result = result.filter(n => n.user_id === userId)
  }
  
  if (unread === 'true') {
    result = result.filter(n => !n.read)
  }
  
  // 排序
  result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  
  return NextResponse.json(result)
}

// 標記為已讀
export async function PUT(request) {
  try {
    const { id } = await request.json()
    
    const notification = notifications.get(id)
    if (!notification) {
      return NextResponse.json({ error: '通知不存在' }, { status: 404 })
    }
    
    notification.read = true
    notifications.set(id, notification)
    
    return NextResponse.json({
      success: true,
      notification
    })
    
  } catch (error) {
    return NextResponse.json({ error: '更新失敗' }, { status: 500 })
  }
}

// ============ 預設通知模板 ============

export const NotificationTemplates = {
  // 預約確認
  booking_confirmed: (booking) => ({
    title: '預約確認',
    content: `您好！您的預約已確認。\n日期：${booking.date}\n時間：${booking.time}\n請準時到店。`
  }),
  
  // 預約提醒
  booking_reminder: (booking) => ({
    title: '預約提醒',
    content: `提醒您，明天有預約。\n日期：${booking.date}\n時間：${booking.time}\n如需改期，請提前聯絡我們。`
  }),
  
  // 支付成功
  payment_success: (order) => ({
    title: '支付成功',
    content: `感謝您的購買！\n訂單金額：HK$${order.amount}\n我們會盡快處理您的訂單。`
  }),
  
  // 會員積分
  points_earned: (points) => ({
    title: '積分獎勵',
    content: `您獲得了 ${points} 積分！\n可用於兌換我們的服務和產品。`
  })
}


