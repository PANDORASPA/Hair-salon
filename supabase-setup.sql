-- Supabase Database Setup Script
-- Run this in your Supabase SQL Editor

-- 1. Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  ref VARCHAR(20) UNIQUE NOT NULL,
  service VARCHAR(100) NOT NULL,
  service_price INTEGER NOT NULL,
  date VARCHAR(20) NOT NULL,
  time VARCHAR(10) NOT NULL,
  staff_id INTEGER,
  staff_name VARCHAR(100),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  coupon VARCHAR(20),
  final_price INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  ref VARCHAR(20) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id),
  user_name VARCHAR(100),
  items TEXT NOT NULL,
  total INTEGER NOT NULL,
  delivery VARCHAR(50) NOT NULL,
  payment VARCHAR(50) NOT NULL,
  address TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create settings table (店鋪設定)
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create services table (服務項目)
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INTEGER DEFAULT 0,
  time INTEGER DEFAULT 60,
  enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- 6. Create products table (產品)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- 7. Create coupons table (優惠碼)
CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100),
  discount INTEGER DEFAULT 0,
  type VARCHAR(20) DEFAULT 'percent',
  min_spend INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Public policies (anyone can read/write for demo)
CREATE POLICY "Public bookings" ON bookings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public users" ON users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public orders" ON orders FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public settings" ON settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public services" ON services FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public products" ON products FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public coupons" ON coupons FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Insert default services
INSERT INTO services (name, price, time, enabled, sort_order) VALUES
  ('剪髮', 280, 60, true, 1),
  ('染髮', 680, 120, true, 2),
  ('燙髮', 880, 150, true, 3),
  ('護髮', 380, 60, true, 4),
  ('头皮护理', 450, 45, true, 5)
ON CONFLICT DO NOTHING;

-- Insert default products
INSERT INTO products (name, price, stock, enabled, sort_order) VALUES
  ('DS100 護髮精華素', 680, 10, true, 1),
  ('头皮護理液', 280, 20, true, 2),
  ('天然護髮油', 180, 15, true, 3),
  ('專業洗髮水', 150, 25, true, 4),
  ('髮泥定型', 120, 30, true, 5)
ON CONFLICT DO NOTHING;

-- Insert default coupons
INSERT INTO coupons (code, name, discount, type, min_spend, enabled) VALUES
  ('NEW20', '新客8折', 20, 'percent', 0, true),
  ('SAVE100', '節省$100', 100, 'fixed', 500, true),
  ('MEMBER10', '會員9折', 10, 'percent', 0, true)
ON CONFLICT DO NOTHING;

-- 8. Create staff table (員工)
CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT '髮型師',
  phone VARCHAR(20),
  enabled BOOLEAN DEFAULT true,
  schedule JSONB DEFAULT '{}',
  services JSONB DEFAULT '[]',
  daysOff JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create articles table (文章)
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(50),
  excerpt TEXT,
  content TEXT,
  image_url VARCHAR(500),
  enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Create faqs table (常見問題)
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question VARCHAR(500) NOT NULL,
  answer TEXT,
  sort_order INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for staff
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public staff" ON staff FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Enable RLS for articles
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public articles" ON articles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Enable RLS for faqs
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public faqs" ON faqs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Insert default staff
INSERT INTO staff (name, role, phone, enabled, schedule, services, daysOff) VALUES
  ('髮型師A', '髮型師', '', true, '{}', '[1,2,3,4,5]', '[]'),
  ('助理A', '助理', '', true, '{}', '[1,4,5]', '[]')
ON CONFLICT DO NOTHING;

-- Insert default articles
INSERT INTO articles (title, category, excerpt, enabled, sort_order) VALUES
  ('如何選擇適合自己的髮型？', '髮型貼士', '根據臉型、髮質同埋個人風格嚟選擇最適合既髮型...', true, 1),
  ('護髮小知識 - 你要知既5件事', '護髮知識', '日常護髮既錯誤示範同正確方法...', true, 2),
  ('脫髮原因同改善方法', '头皮護理', '點解會甩頭髮？等我哋教你點樣改善...', true, 3)
ON CONFLICT DO NOTHING;

-- Insert default faqs
INSERT INTO faqs (question, answer, sort_order, enabled) VALUES
  ('如何預約服務？', '您可以通過我們的網站直接預約，選擇服務項目、日期和時間，填寫資料後即可提交預約。', 1, true),
  ('預約需要付訂金嗎？', '一般預約不需要付訂金，但如果您需要取消或更改預約，請提前一天通知我們。', 2, true),
  ('營業時間是？', '我們的營業時間為早上9點至晚上7點，每逢星期一休息。', 3, true),
  ('可以網上付款嗎？', '是的，我們支援信用卡、PayMe和轉數快等付款方式。', 4, true),
  ('取消預約的政策？', '請於預約日期前1天取消或更改，否則可能會收取一定費用。', 5, true)
ON CONFLICT DO NOTHING;
