// ========================================
// Vercel Serverless API - 髮型屋預約系統
// ========================================

// 內存存儲 (Vercel Serverless 會在每次請求時重置)
// 生產環境建議使用 Vercel KV 或其他數據庫

let bookings = [];

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { url, method } = req;
    const path = url.split('?')[0];

    try {
        // 公開 API
        if (path === '/api/booking/create' && method === 'POST') {
            return createBooking(req, res);
        }

        if (path === '/api/booking/check' && method === 'GET') {
            return checkBooking(req, res);
        }

        // 管理員 API
        if (path === '/api/admin/login' && method === 'POST') {
            return adminLogin(req, res);
        }

        if (path === '/api/admin/bookings' && method === 'GET') {
            return getBookings(req, res);
        }

        if (path === '/api/admin/stats' && method === 'GET') {
            return getStats(req, res);
        }

        if (path === '/api/bookings' && method === 'GET') {
            return getAllBookings(req, res);
        }

        return res.status(404).json({ error: 'Not Found' });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

// 生成預約ID
function generateId() {
    return 'BK' + Date.now().toString().slice(-8);
}

// 服務價格表
const PRICES = {
    'cut-basic': { name: '剪髮 (Basic)', price: 280 },
    'cut-senior': { name: '剪髮 (Senior)', price: 380 },
    'color-single': { name: '染髮 (Single Tone)', price: 680 },
    'color-gradient': { name: '染髮 (Gradient)', price: 980 },
    'perm-digital': { name: '燙髮 (Digital Perm)', price: 880 },
    'perm-straight': { name: '燙髮 (Straight Perm)', price: 980 },
    'treatment': { name: '護髮療程', price: 380 },
    'spa': { name: '頭髮 SPA', price: 580 }
};

const STAFF_NAMES = {
    'mark': 'Mark',
    'sophia': 'Sophia', 
    'jack': 'Jack'
};

// 創建預約
async function createBooking(req, res) {
    const body = req.body;
    const { service, staff, date, time, customer } = body;

    // 驗證必填項
    if (!service || !date || !time || !customer?.name || !customer?.phone) {
        return res.status(400).json({ success: false, error: '缺少必填項' });
    }

    // 電話驗證 (香港電話)
    if (!/^[5689]\d{7}$/.test(customer.phone)) {
        return res.status(400).json({ success: false, error: '電話格式錯誤 (需為8位數字)' });
    }

    // 檢查重複預約
    const exists = bookings.some(b => 
        b.date === date && 
        b.time === time &&
        (!staff || staff === 'any' || b.staff === staff)
    );

    if (exists) {
        return res.status(400).json({ success: false, error: '該時段已被預約' });
    }

    const booking = {
        id: generateId(),
        service,
        serviceName: PRICES[service]?.name || service,
        staff: staff || 'any',
        staffName: staff ? (STAFF_NAMES[staff] || staff) : '任何髮型師',
        date,
        time,
        customer: {
            name: customer.name,
            phone: customer.phone,
            remark: customer.remark || ''
        },
        price: PRICES[service]?.price || 0,
        createdAt: new Date().toISOString()
    };

    bookings.push(booking);

    return res.status(200).json({ 
        success: true, 
        bookingId: booking.id, 
        booking 
    });
}

// 查詢預約
async function checkBooking(req, res) {
    const { bookingId } = req.query;
    const booking = bookings.find(b => b.id === bookingId);

    if (booking) {
        return res.status(200).json(booking);
    }
    return res.status(404).json({ error: '找不到預約' });
}

// 獲取所有預約 (公開 - 給前端同步用)
async function getAllBookings(req, res) {
    return res.status(200).json(bookings);
}

// 管理員登入
async function adminLogin(req, res) {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'palace2026') {
        const token = btoa(JSON.stringify({ username, password }));
        return res.status(200).json({ success: true, token });
    }
    return res.status(401).json({ success: false, error: '登入失敗' });
}

// 認證檢查
function authenticate(auth) {
    if (!auth) return false;
    try {
        const decoded = JSON.parse(atob(auth));
        return decoded.username === 'admin' && decoded.password === 'palace2026';
    } catch {
        return false;
    }
}

// 獲取所有預約 (管理員)
async function getBookings(req, res) {
    if (!authenticate(req.headers.authorization)) {
        return res.status(401).json({ error: '未認證' });
    }

    const { date } = req.query;
    let result = [...bookings];

    if (date) result = result.filter(b => b.date === date);

    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({ bookings: result, total: result.length });
}

// 統計
async function getStats(req, res) {
    if (!authenticate(req.headers.authorization)) {
        return res.status(401).json({ error: '未認證' });
    }

    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().getMonth();

    const todayBookings = bookings.filter(b => b.date === today);
    const monthBookings = bookings.filter(b => new Date(b.date).getMonth() === thisMonth);

    return res.status(200).json({
        todayCount: todayBookings.length,
        monthCount: monthBookings.length,
        totalRevenue: monthBookings.reduce((sum, b) => sum + (b.price || 0), 0),
        totalCount: bookings.length
    });
}
