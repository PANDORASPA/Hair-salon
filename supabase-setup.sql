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
