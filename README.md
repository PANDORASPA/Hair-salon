# VIVA HAIR - Next.js 髮型屋預約系統

九龍太子通菜街17A 髮型屋預約系統

## 📁 項目結構

```
viva-hair-next/
├── app/                    # Next.js App Router
│   ├── page.js            # 首頁
│   ├── layout.js          # 根布局
│   ├── globals.css        # 全局樣式
│   ├── booking/           # 預約頁面
│   ├── tickets/           # 套票頁面
│   ├── services/          # 服務頁面
│   ├── products/          # 產品頁面
│   ├── articles/          # 文章頁面
│   ├── faq/              # FAQ頁面
│   ├── coupons/          # 優惠頁面
│   ├── login/             # 登入/註冊
│   └── admin/             # 管理後台
├── lib/
│   ├── supabase.js       # Supabase 配置
│   └── api.js            # API 客戶端
└── package.json
```

## 🚀 快速開始

### 1. 安裝依賴

```bash
cd viva-hair-next
npm install
```

### 2. 環境變量

創建 `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

### 3. 啟動

```bash
npm run dev
```

訪問 http://localhost:3000

## 🔧 功能

- [x] 用戶系統 (登入/註冊)
- [x] 預約系統
- [x] 套票系統
- [x] 產品商店
- [x] 文章系統
- [x] FAQ
- [x] 後台管理
- [x] Stripe 支付

## 📝 License

MIT
