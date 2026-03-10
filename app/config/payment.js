// VIVA HAIR - Payment Configuration

// ===== Stripe Setup =====
// 等你有Stripe account後，係 https://stripe.com/signup
// 整好後係Dashboard度搵Publishable Key

export const STRIPE_CONFIG = {
  publishableKey: 'pk_test_YOUR_PUBLISHABLE_KEY',  // 例如: pk_test_51...
  currency: 'hkd',
  locale: 'zh-HK',
}

// Payment methods
export const PAYMENT_METHODS = [
  { id: 'fps', name: 'FPS轉數快', icon: '🏦' },
  { id: 'payme', name: 'PayMe', icon: '💚' },
  { id: 'whatsapp', name: 'WhatsApp轉帳', icon: '💬' },
  { id: 'cash', name: '現金', icon: '💵' },
]

// Demo mode - 當冇Stripe既時候用
export const DEMO_MODE = true

// ===== 使用方法 =====

// 1. Install Stripe: npm install @stripe/stripe-js

// 2. 係cart page度import:
// import { loadStripe } from '@stripe/stripe-js'
// import { STRIPE_CONFIG } from './config'

// 3. Initialize Stripe:
// const stripe = await loadStripe(STRIPE_CONFIG.publishableKey)

// 4. Create checkout session (需要backend API):
// const response = await fetch('/api/create-checkout-session', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ items: cart })
// })
// const session = await response.json()
// await stripe.redirectToCheckout({ sessionId: session.id })

// ===== Payment Flow =====

/*
1. 用戶加入套票/產品去購物車
2. 去到cart page
3. 選擇付款方式 (FPS/PayMe/WhatsApp/現金)
4. 點擊"前往付款"
5. 如果係FPS/PayMe:
   - Showpayment details (銀行入數資料)
   - 用戶過數後confirm
6. 如果Stripe:
   - redirect去Stripe checkout
   - 完成後redirect返黎
7. 存入數據庫 + 發送確認通知
*/

// ===== Payment Success Page =====

/*
用戶完成payment後可以去 /payment/success?session_id=xxx
Show:
- 訂單確認
- 預約資料
- 感謝訊息
*/
