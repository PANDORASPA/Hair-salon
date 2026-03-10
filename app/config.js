// VIVA HAIR - Configuration
// 所有的設定都在呢度改

export const CONFIG = {
  // ===== 商戶資料 =====
  business: {
    name: 'VIVA HAIR',
    phone: '+852 1234 5678',
    whatsapp: '+852 1234 5678',
    address: '九龍太子通菜街17A 1樓',
    email: 'vivahair@example.com',
    instagram: '',
    facebook: '',
  },

  // ===== 營業時間 =====
  businessHours: {
    monday: { open: '10:00', close: '20:00', enabled: true },
    tuesday: { open: '10:00', close: '20:00', enabled: true },
    wednesday: { open: '10:00', close: '20:00', enabled: true },
    thursday: { open: '10:00', close: '20:00', enabled: true },
    friday: { open: '10:00', close: '20:00', enabled: true },
    saturday: { open: '10:00', close: '20:00', enabled: true },
    sunday: { open: '10:00', close: '20:00', enabled: true },
  },

  // ===== 預約設定 =====
  booking: {
    advanceDays: 30,      // 最多預約幾多日後
    minAdvanceHours: 2,   // 最少提前幾多小時預約
    deposit: 0,           // 訂金 (0 = 免訂金)
    canCancel: true,      // 可以取消
    cancelHours: 24,      // 幾多小時前可取消
  },

  // ===== 服務項目 =====
  services: [
    { id: 'cut', name: '剪髮', price: 280, duration: 60, emoji: '✂️', desc: '專業剪髮造型', active: true },
    { id: 'color', name: '染髮', price: 680, duration: 120, emoji: '🎨', desc: '專業染髮服務', active: true },
    { id: 'perm', name: '燙髮', price: 880, duration: 150, emoji: '💇', desc: '韓式燙髮', active: true },
    { id: 'treatment', name: '護髮', price: 380, duration: 60, emoji: '🧴', desc: '深層護理', active: true },
    { id: 'styling', name: '造型', price: 180, duration: 30, emoji: '✨', desc: '約會/宴會造型', active: true },
    { id: 'bridal', name: '新娘造型', price: 1280, duration: 180, emoji: '👰', desc: '新娘化妝髮型', active: true },
  ],

  // ===== 髮型師/員工 =====
  staff: [
    { id: 'mark', name: 'Mark', title: '創意總監', emoji: '👨‍💼', active: true,
      schedule: { mon: ['10:00-13:00','14:00-19:00'], tue: ['10:00-13:00','14:00-19:00'], wed: ['10:00-13:00','14:00-19:00'], thu: ['10:00-13:00','14:00-19:00'], fri: ['10:00-13:00','14:00-19:00'], sat: ['10:00-13:00','14:00-19:00'], sun: [] }
    },
    { id: 'sophia', name: 'Sophia', title: '高級髮型師', emoji: '👩‍💼', active: true,
      schedule: { mon: [], tue: ['11:00-14:00','15:00-20:00'], wed: [], thu: ['11:00-14:00','15:00-20:00'], fri: ['11:00-14:00','15:00-20:00'], sat: ['11:00-14:00','15:00-20:00'], sun: ['11:00-14:00','15:00-20:00'] }
    },
    { id: 'jack', name: 'Jack', title: '資深髮型師', emoji: '👨‍💇', active: true,
      schedule: { mon: ['10:00-13:00','14:00-18:00'], tue: ['10:00-13:00','14:00-18:00'], wed: ['10:00-13:00','14:00-18:00'], thu: ['10:00-13:00','14:00-18:00'], fri: [], sat: ['10:00-13:00','14:00-18:00'], sun: [] }
    },
    { id: 'lily', name: 'Lily', title: '髮型師', emoji: '👩‍💇', active: true,
      schedule: { mon: ['12:00-15:00','16:00-21:00'], tue: ['12:00-15:00','16:00-21:00'], wed: ['12:00-15:00','16:00-21:00'], thu: ['12:00-15:00','16:00-21:00'], fri: ['12:00-15:00','16:00-21:00'], sat: [], sun: ['12:00-15:00','16:00-21:00'] }
    },
  ],

  // ===== 套票 =====
  tickets: [
    { id: 'basic', name: 'Basic套餐', price: 680, original: 860, visits: 2, emoji: '🎁', desc: '剪髮+護髮', services: ['cut', 'treatment'], active: true },
    { id: 'premium', name: 'Premium套餐', price: 1280, original: 1680, visits: 2, emoji: '💎', desc: '染髮+護髮', services: ['color', 'treatment'], active: true },
    { id: 'luxury', name: 'Luxury套餐', price: 2380, original: 3180, visits: 3, emoji: '👑', desc: '燙髮+護髮+造型', services: ['perm', 'treatment', 'styling'], active: true },
    { id: 'annual', name: '年費會員', price: 5800, original: 8800, visits: 12, emoji: '🌟', desc: '全年剪髮', services: ['cut'], active: true },
  ],

  // ===== 產品 =====
  products: [
    { id: 1, name: 'Kerastase養髮精華', price: 380, emoji: '🧴', desc: '法國專業護髮', stock: 20, active: true },
    { id: 2, name: 'Shiseido洗髮水', price: 280, emoji: '🫧', desc: '日本頂級髮品', stock: 30, active: true },
    { id: 3, name: 'Milbon護髮素', price: 180, emoji: '💧', desc: '日系沙龍專用', stock: 25, active: true },
    { id: 4, name: 'Moroccanoil髮油', price: 320, emoji: '🫒', desc: '摩洛哥堅果油', stock: 15, active: true },
    { id: 5, name: 'Christophe Robin髮膜', price: 450, emoji: '🌿', desc: '深層清潔髮膜', stock: 10, active: true },
    { id: 6, name: 'Olaplex修復液', price: 580, emoji: '🔬', desc: '結構修復', stock: 8, active: true },
  ],

  // ===== 文章 =====
  articles: [
    { id: 1, title: '點樣保護染髮後既頭髮？', category: '護理', emoji: '🎨', date: '2026-03-01', excerpt: '分享染髮後護理既重要知識，等你既髮色更持久...', active: true },
    { id: 2, title: '2026髮型趨勢預測', category: '潮流', emoji: '💇', date: '2026-02-15', excerpt: '今年流行咩髮型？話你知以下幾款大熱...', active: true },
    { id: 3, title: '燙髮前要知既5件事', category: '教學', emoji: '💆', date: '2026-02-01', excerpt: '燙髮前既準備工作，等你燙得更滿意...', active: true },
    { id: 4, title: '頭髮乾枯點算？', category: '護理', emoji: '🧴', date: '2026-01-20', excerpt: '天然護髮方法大公開，等你頭髮重現光澤...', active: true },
  ],

  // ===== FAQ =====
  faqs: [
    { q: '預約可以改期嗎？', a: '可以，請提前24小時通知我們改期。', active: true },
    { q: '取消預約會扣訂金嗎？', a: '24小時內取消會扣除訂金作為取消費用。', active: true },
    { q: '我可以帶自己既髮型圖片嗎？', a: '當然可以！我們鼓勵客人帶圖片溝通你想要既髮型。', active: true },
    { q: '燙髮可以維持幾耐？', a: '一般可以維持3-6個月，視乎個人髮質同護理。', active: true },
    { q: '有冇學生優惠？', a: '有！出示學生證可享9折優惠。', active: true },
    { q: '可以只剪劉海嗎？', a: '可以既，最少收費$100。', active: true },
  ],

  // ===== 優惠碼 =====
  coupons: [
    { code: 'BDAY2026', discount: 50, type: 'fixed', desc: '生日優惠', minSpend: 0, expires: '2026-12-31', active: true },
    { code: 'NEW20', discount: 20, type: 'percent', desc: '新客8折', minSpend: 200, expires: '2026-12-31', active: true },
    { code: 'SUMMER30', discount: 30, type: 'percent', desc: '夏日優惠', minSpend: 500, expires: '2026-08-31', active: true },
  ],

  // ===== 系統設定 =====
  system: {
    currency: 'HKD',
    language: 'zh-HK',
    timezone: 'Asia/Hong_Kong',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
  }
}

// Helper functions
export function getActiveServices() {
  return CONFIG.services.filter(s => s.active)
}

export function getActiveStaff() {
  return CONFIG.staff.filter(s => s.active)
}

export function getActiveTickets() {
  return CONFIG.tickets.filter(t => t.active)
}

export function getActiveProducts() {
  return CONFIG.products.filter(p => p.active)
}

export function getActiveArticles() {
  return CONFIG.articles.filter(a => a.active)
}

export function getActiveFAQs() {
  return CONFIG.faqs.filter(f => f.active)
}

export function getActiveCoupons() {
  return CONFIG.coupons.filter(c => c.active)
}

export function getBusinessHours() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayNames = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
  
  return days.map((day, i) => ({
    day,
    name: dayNames[i],
    ...CONFIG.businessHours[day]
  }))
}

export function isOpenToday() {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const today = days[new Date().getDay()]
  return CONFIG.businessHours[today]?.enabled
}

export function getTodayHours() {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const today = days[new Date().getDay()]
  return CONFIG.businessHours[today]
}
