/**
 * 支付 API
 * POST /api/payment/create-intent - 創建支付意圖 (Stripe)
 * POST /api/payment/webhook - Stripe Webhook
 * POST /api/payment/fps - FPS 支付
 */

import { NextResponse } from 'next/server'

// Stripe 配置 (實際使用時填入)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_xxx')

// Mock 支付記錄
const payments = new Map()

// 創建 Stripe Payment Intent
export async function POST(request) {
  try {
    const { action, amount, currency, booking_id, user_id } = await request.json()
    
    if (action === 'create-intent') {
      // 創建 Stripe Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe 用分
        currency: currency || 'hkd',
        metadata: {
          booking_id: booking_id || '',
          user_id: user_id || ''
        }
      })
      
      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentId: paymentIntent.id
      })
    }
    
    if (action === 'fps') {
      // FPS 支付 (Mock)
      const payment = {
        id: 'fps_' + Date.now(),
        booking_id,
        user_id,
        amount,
        method: 'fps',
        status: 'pending',
        created_at: new Date().toISOString()
      }
      
      payments.set(payment.id, payment)
      
      return NextResponse.json({
        success: true,
        payment,
        instructions: '請使用 FPS 轉賬至我們的賬戶，完成後系統會自動確認'
      })
    }
    
    if (action === 'check-status') {
      // 檢查支付狀態
      const payment = Array.from(payments.values()).find(
        p => p.booking_id === booking_id
      )
      
      if (!payment) {
        return NextResponse.json({ status: 'not_found' })
      }
      
      return NextResponse.json({ status: payment.status })
    }
    
    return NextResponse.json({ error: '無效既 action' }, { status: 400 })
    
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json({ error: '支付失敗' }, { status: 500 })
  }
}

// Stripe Webhook
export async function PUT(request) {
  try {
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')
    
    let event
    
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || 'whsec_xxx'
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Webhook 驗證失敗' }, { status: 400 })
    }
    
    // 處理事件
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('Payment succeeded:', paymentIntent.id)
        // 更新預約狀態為已支付
        // await updateBookingPaymentStatus(paymentIntent.metadata.booking_id, 'paid')
        break
        
      case 'payment_intent.payment_failed':
        const failed = event.data.object
        console.log('Payment failed:', failed.id)
        break
    }
    
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook 錯誤' }, { status: 500 })
  }
}


