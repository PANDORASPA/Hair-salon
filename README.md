# VIVA HAIR 髮型屋預約系統

一個簡約時尚既髮型屋預約網站，用 Next.js 開發。

## 功能

- 首頁展示同服務推廣
- 網上預約系統
- 套票購買
- 產品商店
- 會員系統
- 管理後台

## 快速開始

```bash
# 安裝
npm install

# 開發
npm run dev

# 構建
npm run build

# 發布
npm run start
```

## 環境變量

如使用 Supabase 數據庫，請複製 `.env.example` 為 `.env.local` 並填入相關 keys。

## 技術

- Next.js 14
- React
- CSS Modules / Inline Styles
- LocalStorage (預設數據存儲)

## 目錄結構

```
viva-hair-next/
├── app/
│   ├── page.js         # 首頁
│   ├── layout.js       #  Layout
│   ├── globals.css     # 全局樣式
│   ├── booking/        # 預約頁面
│   ├── services/       # 服務頁面
│   ├── tickets/        # 套票頁面
│   ├── products/       # 產品頁面
│   ├── articles/       # 文章頁面
│   ├── coupons/        # 優惠碼頁面
│   ├── faq/            # 常見問題
│   ├── login/          # 登入/註冊
│   └── admin/          # 管理後台
├── .env.example        # 環境變量樣板
├── package.json
└── next.config.js
```

## License

MIT
