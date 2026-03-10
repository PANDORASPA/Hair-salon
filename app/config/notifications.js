// VIVA HAIR - Notification Configuration

// ===== Email Setup (SendGrid) =====
// 註冊 https://sendgrid.com
// 整好後係Settings度搵API Key

export const EMAIL_CONFIG = {
  fromEmail: 'noreply@vivahair.com',
  fromName: 'VIVA HAIR',
  // SendGrid API Key (當整好account後填入)
  sendGridApiKey: 'YOUR_SENDGRID_API_KEY',
}

// ===== SMS Setup (Twilio) =====
// 註冊 https://twilio.com
// 整好後係Console度搵Account SID同Auth Token

export const SMS_CONFIG = {
  accountSid: 'YOUR_TWILIO_ACCOUNT_SID',
  authToken: 'YOUR_TWILIO_AUTH_TOKEN',
  fromNumber: '+85212345678',  // 你既Twilio電話號碼
}

// ===== WhatsApp Setup (Twilio) =====
// 用既係Twilio既WhatsApp API

export const WHATSAPP_CONFIG = {
  accountSid: 'YOUR_TWILIO_ACCOUNT_SID',
  authToken: 'YOUR_TWILIO_AUTH_TOKEN',
  fromNumber: 'whatsapp:+14155238886',  // Twilio Sandbox Number
}

// ===== Notification Types =====

export const NOTIFICATION_TYPES = {
  // Booking notifications
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_REMINDER: 'booking_reminder',
  BOOKING_CANCELLED: 'booking_cancelled',
  
  // Payment notifications  
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_CONFIRMED: 'payment_confirmed',
  
  // Member notifications
  BIRTHDAY_VOUCHER: 'birthday_voucher',
  POINTS_EARNED: 'points_earned',
}

// ===== Template Messages =====

export const MESSAGE_TEMPLATES = {
  // WhatsApp / SMS Templates
  booking_confirmed: {
    zh: '【VIVA HAIR】預約確認！\n\n服務: {service}\n髮型師: {staff}\n日期: {date} {time}\n\n多謝預約！我們到時見！',
  },
  
  booking_reminder: {
    zh: '【VIVA HAIR】提醒您\n\n聽日既預約:\n服務: {service}\n髮型師: {staff}\n時間: {time}\n\n如需改期，請聯絡我地！',
  },
  
  payment_received: {
    zh: '【VIVA HAIR】收款確認\n\n訂單編號: {orderId}\n金額: ${amount}\n\n多謝購買！套票已存入您既帳戶。',
  },
  
  birthday_voucher: {
    zh: '【VIVA HAIR】🎂 生日快樂！\n\n為您送上$50生日優惠券！\n優惠碼: BDAY2026\n\n有効期30日。\n\n多謝支持！',
  },
  
  // Email Templates (HTML)
  booking_confirmed_email: {
    subject: '【VIVA HAIR】預約確認',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #A68B6A;">VIVA HAIR - 預約確認</h2>
        <p>多謝您的預約！以下是預約資料：</p>
        <div style="background: #FAF8F5; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>服務：</strong> {service}</p>
          <p><strong>髮型師：</strong> {staff}</p>
          <p><strong>日期：</strong> {date}</p>
          <p><strong>時間：</strong> {time}</p>
        </div>
        <p>如有任何問題，請聯絡我們。</p>
        <p>九龍太子通菜街17A 1樓</p>
      </div>
    `,
  },
}

// ===== Send Notification Functions =====

// 呢啲係placeholder functions
// 等你整好各API既credentials後就可以用

export async function sendBookingConfirmation(booking) {
  console.log('Sending booking confirmation for:', booking.id)
  
  // 1. Send WhatsApp (if configured)
  if (WHATSAPP_CONFIG.accountSid !== 'YOUR_TWILIO_ACCOUNT_SID') {
    // Call WhatsApp API
    // await sendWhatsApp(booking.phone, MESSAGE_TEMPLATES.booking_confirmed.zh.replace(...))
  }
  
  // 2. Send SMS (if configured)
  if (SMS_CONFIG.accountSid !== 'YOUR_TWILIO_ACCOUNT_SID') {
    // Call SMS API
  }
  
  // 3. Send Email (if configured)
  if (EMAIL_CONFIG.sendGridApiKey !== 'YOUR_SENDGRID_API_KEY') {
    // Call SendGrid API
  }
  
  return { success: true }
}

export async function sendPaymentConfirmation(payment) {
  console.log('Sending payment confirmation for:', payment.id)
  // Similar to above
}

export async function sendBirthdayVoucher(phone) {
  console.log('Sending birthday voucher to:', phone)
  // Send birthday voucher
}

export async function sendBookingReminder(booking) {
  console.log('Sending booking reminder for:', booking.id)
  // Send reminder 24h before
}

// ===== Demo / Console Log Mode =====

export function logNotification(type, data) {
  if (typeof window !== 'undefined') {
    console.log(`📧 Notification [${type}]:`, data)
  }
}
