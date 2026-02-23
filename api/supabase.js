/**
 * ========================================
 * Supabase 配置 - 髮型屋數據庫
 * ========================================
 * 
 * 使用方法：
 * 1. 去 https://supabase.com 創建帳戶
 * 2. 創建新項目
 * 3. 拎住 URL + Anon Key
 * 4. 填低下面既配置
 * 5. 運行 SQL 創建表格
 */

// ====== 請填入你既 Supabase 資料 ======
const SUPABASE_URL = 'YOUR_SUPABASE_URL';  // 例如: https://xxxxx.supabase.co
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';  // 例如: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// ========================================

/**
 * 數據庫表格 SQL (響 Supabase 既 SQL Editor 度運行)
 */

const CREATE_TABLES_SQL = `
-- 客戶表格
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    gender TEXT,
    age TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 預約表格
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    service TEXT NOT NULL,
    stylist TEXT,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 服務項目表格
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price INTEGER,
    duration INTEGER,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 髮型師表格
CREATE TABLE IF NOT EXISTS stylists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT,
    avatar TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 營業時間表格
CREATE TABLE IF NOT EXISTS business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week INTEGER NOT NULL,
    open_time TEXT NOT NULL,
    close_time TEXT NOT NULL,
    is_closed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 啟用 Realtime (可選)
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
`;

/**
 * Supabase Client
 */
class SupabaseClient {
    constructor(url, key) {
        this.url = url;
        this.key = key;
    }
    
    async query(table, options = {}) {
        const { method = 'GET', body = null, filters = {} } = options;
        
        let url = `${this.url}/rest/v1/${table}`;
        
        // Add filters
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            params.append(key, value);
        });
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const headers = {
            'apikey': this.key,
            'Authorization': `Bearer ${this.key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
        
        try {
            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : null
            });
            
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }
            
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Supabase Error:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Shortcuts
    select(table, filters = {}) { return this.query(table, { filters }); }
    insert(table, data) { return this.query(table, { method: 'POST', body: data }); }
    update(table, data, filters) { return this.query(table, { method: 'PATCH', body: data, filters }); }
    delete(table, filters) { return this.query(table, { method: 'DELETE', filters }); }
}

// Create global instance
const supabase = SUPABASE_URL !== 'YOUR_SUPABASE_URL' 
    ? new SupabaseClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

// Export
if (typeof window !== 'undefined') {
    window.supabase = supabase;
    window.SUPABASE_CONFIG = { CREATE_TABLES_SQL };
}
