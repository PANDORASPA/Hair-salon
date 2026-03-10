/**
 * 用戶認證 API
 * POST /api/auth/register - 註冊
 * POST /api/auth/login - 登入
 * POST /api/auth/logout - 登出
 * GET /api/auth/me - 獲取當前用戶
 */

import { NextResponse } from 'next/server'

// Mock 數據庫 (實際使用時替換為 Supabase)
const users = new Map()

// 密碼加密 (實際使用 bcrypt)
const hashPassword = (password) => {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return 'hashed_' + Math.abs(hash).toString(16)
}

const verifyPassword = (password, hash) => {
  return hashPassword(password) === hash
}

// 生成 JWT Token (實際使用 jsonwebtoken)
const generateToken = (user) => {
  return Buffer.from(JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000
  })).toString('base64')
}

// 註冊
export async function POST(request) {
  try {
    const { action, email, password, name, phone } = await request.json()
    
    if (action === 'register') {
      // 檢查用戶是否已存在
      const existingUser = Array.from(users.values()).find(u => u.email === email)
      if (existingUser) {
        return NextResponse.json({ error: '此電郵已註冊' }, { status: 400 })
      }
      
      // 創建新用戶
      const user = {
        id: Date.now().toString(),
        email,
        password_hash: hashPassword(password),
        name: name || '',
        phone: phone || '',
        role: 'customer',
        points: 0,
        created_at: new Date().toISOString()
      }
      
      users.set(user.id, user)
      
      // 生成 token
      const token = generateToken(user)
      
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          points: user.points
        },
        token
      })
    }
    
    if (action === 'login') {
      // 查找用戶
      const user = Array.from(users.values()).find(u => u.email === email)
      if (!user) {
        return NextResponse.json({ error: '電郵或密碼錯誤' }, { status: 401 })
      }
      
      // 驗證密碼
      if (!verifyPassword(password, user.password_hash)) {
        return NextResponse.json({ error: '電郵或密碼錯誤' }, { status: 401 })
      }
      
      // 生成 token
      const token = generateToken(user)
      
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          points: user.points
        },
        token
      })
    }
    
    return NextResponse.json({ error: '無效既 action' }, { status: 400 })
    
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: '服務器錯誤' }, { status: 500 })
  }
}

// 獲取當前用戶
export async function GET(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json({ error: '未登入' }, { status: 401 })
  }
  
  try {
    const userData = JSON.parse(Buffer.from(token, 'base64').toString())
    
    if (userData.exp < Date.now()) {
      return NextResponse.json({ error: 'Token 過期' }, { status: 401 })
    }
    
    const user = users.get(userData.id)
    if (!user) {
      return NextResponse.json({ error: '用戶不存在' }, { status: 404 })
    }
    
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      points: user.points
    })
    
  } catch (error) {
    return NextResponse.json({ error: '無效既 token' }, { status: 401 })
  }
}


