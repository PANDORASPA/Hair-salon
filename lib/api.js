/**
 * 前端 API 客戶端
 * 所有頁面通過呢個同後端 API 溝通
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

// 通用請求函數
async function request(endpoint, options = {}) {
  const url = API_BASE + endpoint
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }
  
  // 如果有 token，自動加入
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  try {
    const response = await fetch(url, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || '請求失敗')
    }
    
    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// ============ 用戶 API ============

export const authAPI = {
  // 登入
  login: (email, password) => 
    request('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', email, password })
    }),
  
  // 註冊
  register: (email, password, name, phone) =>
    request('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'register', email, password, name, phone })
    }),
  
  // 獲取當前用戶
  me: () => request('/api/auth'),
  
  // 登出
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
  
  // 保存 token
  saveToken: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    }
  },
  
  // 獲取保存的用戶
  getUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    }
    return null
  }
}

// ============ 預約 API ============

export const bookingAPI = {
  // 獲取預約列表
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/api/bookings${query ? '?' + query : ''}`)
  },
  
  // 創建預約
  create: (data) => 
    request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  // 取消預約
  cancel: (id) =>
    request('/api/bookings', {
      method: 'PUT',
      body: JSON.stringify({ id, status: 'cancelled' })
    })
}

// ============ 數據 API ============

export const dataAPI = {
  // 獲取分類
  categories: () => request('/api/data/categories'),
  
  // 獲取服務
  services: () => request('/api/data/services'),
  
  // 獲取套票
  tickets: () => request('/api/data/tickets'),
  
  // 獲取產品
  products: () => request('/api/data/products'),
  
  // 獲取文章
  articles: () => request('/api/data/articles'),
  
  // 創建項目
  create: (type, data) =>
    request(`/api/data/${type}`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  // 更新項目
  update: (type, data) =>
    request(`/api/data/${type}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  
  // 刪除項目
  delete: (type, id) =>
    request(`/api/data/${type}`, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    })
}

// ============ 支付 API ============

export const paymentAPI = {
  // 創建 Stripe Payment Intent
  createIntent: (amount, bookingId, userId) =>
    request('/api/payment', {
      method: 'POST',
      body: JSON.stringify({
        action: 'create-intent',
        amount,
        booking_id: bookingId,
        user_id: userId
      })
    }),
  
  // FPS 支付
  fps: (amount, bookingId, userId) =>
    request('/api/payment', {
      method: 'POST',
      body: JSON.stringify({
        action: 'fps',
        amount,
        booking_id: bookingId,
        user_id: userId
      })
    }),
  
  // 檢查支付狀態
  checkStatus: (bookingId) =>
    request('/api/payment', {
      method: 'POST',
      body: JSON.stringify({
        action: 'check-status',
        booking_id: bookingId
      })
    })
}

// ============ 通知 API ============

export const notificationAPI = {
  // 獲取通知
  list: (userId) =>
    request(`/api/notifications${userId ? '?user_id=' + userId : ''}`),
  
  // 標記已讀
  markRead: (id) =>
    request('/api/notifications', {
      method: 'PUT',
      body: JSON.stringify({ id })
    }),
  
  // 發送通知
  send: (data) =>
    request('/api/notifications', {
      method: 'POST',
      body: JSON.stringify(data)
    })
}

// ============ 訂單 API ============

export const orderAPI = {
  // 創建訂單
  create: (items, totalAmount) => {
    const user = authAPI.getUser()
    return request('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        user_id: user?.id,
        items,
        total_amount: totalAmount
      })
    })
  },
  
  // 獲取訂單列表
  list: (userId) =>
    request(`/api/orders${userId ? '?user_id=' + userId : ''}`)
}

// 導出所有 API
export default {
  auth: authAPI,
  booking: bookingAPI,
  data: dataAPI,
  payment: paymentAPI,
  notification: notificationAPI,
  order: orderAPI
}


