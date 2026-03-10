// VIVA HAIR - Supabase Configuration
// 等你有Supabase account後，係呢度填入你既資料

// 去 https://supabase.com create project後，係Settings度搵到：
// - Project URL (e.g., https://xxxxx.supabase.co)
// - anon public key (e.g., eyJhbGciOiJIUzI1NiIs...)

export const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL',  // 例如: https://abc123.supabase.co
  anonKey: 'YOUR_SUPABASE_ANON_KEY',  // 例如: eyJhbGciOiJIUzI1NiIs...
}

// 暫時用localStorage
export const USE_LOCAL_STORAGE = true

// 等你想用Supabase既時候：
// 1. 去 supabase.com create project
// 2. 係呢度填入 url 同 anonKey
// 3. 改 USE_LOCAL_STORAGE = false
// 4. create tables (睇下面)

// ===== Supabase Tables Schema =====
// 等你整好Supabase後，係SQL Editor度run以下code create tables:

/*

-- 會員表
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  birthday DATE,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 預約表
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  member_id UUID REFERENCES members(id),
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_price INTEGER NOT NULL,
  staff_id TEXT NOT NULL,
  staff_name TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  remark TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 套票表
CREATE TABLE tickets (
  id TEXT PRIMARY KEY,
  member_id UUID REFERENCES members(id),
  name TEXT NOT NULL,
  visits INTEGER NOT NULL,
  remaining INTEGER NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 服務項目表
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  emoji TEXT,
  description TEXT,
  active BOOLEAN DEFAULT true
);

-- 員工表
CREATE TABLE staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  emoji TEXT,
  schedule JSONB,
  active BOOLEAN DEFAULT true
);

-- 套票產品表
CREATE TABLE ticket_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  visits INTEGER NOT NULL,
  emoji TEXT,
  description TEXT,
  services JSONB,
  active BOOLEAN DEFAULT true
);

-- 產品表
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  emoji TEXT,
  description TEXT,
  stock INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

-- 文章表
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  emoji TEXT,
  excerpt TEXT,
  content TEXT,
  date DATE,
  active BOOLEAN DEFAULT true
);

-- FAQ表
CREATE TABLE faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  active BOOLEAN DEFAULT true
);

-- 優惠碼表
CREATE TABLE coupons (
  code TEXT PRIMARY KEY,
  discount_type TEXT NOT NULL,
  discount_value INTEGER NOT NULL,
  description TEXT,
  min_spend INTEGER DEFAULT 0,
  expires_date DATE,
  active BOOLEAN DEFAULT true
);

*/

// ===== 使用方法 =====

// 1. Install supabase client:
// npm install @supabase/supabase-js

// 2. 係你想用既page度import:
// import { supabase } from './supabase'

// 3. 例如讀取bookings:
// const { data, error } = await supabase.from('bookings').select('*')

// 4. 例如新增booking:
// const { data, error } = await supabase.from('bookings').insert([booking])
