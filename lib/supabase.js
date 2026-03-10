/**
 * Supabase 客戶端配置
 * 使用說明：
 * 1. 創建 Supabase 項目: https://supabase.com
 * 2. 獲取 URL 和 Anon Key
 * 3. 填入下方配置
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

// 如果係 client-side，使用呢個
export const createClient = () => {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

// ============ 數據庫 Schema 說明 ============

/*

-- 用戶表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer', -- customer, staff, admin
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 服務表
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- hair, scalp, care
  description TEXT,
  price INTEGER NOT NULL,
  duration INTEGER NOT NULL, -- 分鐘
  image TEXT,
  color TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 套票表
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  times INTEGER NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  features TEXT[],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 產品表
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  original_price INTEGER,
  stock INTEGER DEFAULT 0,
  image TEXT,
  features TEXT[],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 預約表
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  service_id UUID REFERENCES services(id),
  ticket_id UUID REFERENCES tickets(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  notes TEXT,
  total_amount INTEGER NOT NULL,
  payment_status TEXT DEFAULT 'unpaid', -- unpaid, paid, refunded
  payment_method TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 訂單表
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, paid, shipped, completed
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 文章表
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT NOT NULL,
  image TEXT,
  views INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 會員積分記錄
CREATE TABLE points_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  points INTEGER NOT NULL,
  type TEXT NOT NULL, -- earned, redeemed
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 通知表
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL, -- booking, order, system, promotion
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

*/

export { SUPABASE_URL, SUPABASE_ANON_KEY }


