# Palace Hair Studio - 髮型屋預約網站

高級髮型屋線上預約系統，包含完整的前端網站和預約管理後台。

## 📁 專案結構

```
palace-hair-studio/
├── public/                 # 前端靜態檔案
│   ├── index.html         # 首頁 (含預約表單)
│   └── admin.html         # 後台管理
├── api/                   # Vercel Serverless API
│   └── booking.js         # 預約 API
├── package.json           # Node.js 設定
└── README.md             # 說明文件
```

## 🚀 部署到 Vercel

### 方法 1：GitHub 部署 (推薦)

1. **建立 GitHub Repository**
   - 去 https://github.com/new
   - 建立新 repository: `palace-hair-studio`

2. **上傳代碼**
   ```bash
   git clone https://github.com/你的帳號/palace-hair-studio
   cd palace-hair-studio
   # 將 hair-salon 資料夾的內容复制進去
   git add .
   git commit -m "Initial commit"
   git push
   ```

3. **部署**
   - 去 https://vercel.com
   - Click "Add New..." → "Project"
   - 選擇你的 GitHub repository
   - Framework Preset: **Other**
   - Click **Deploy**

### 方法 2：Vercel CLI

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入
vercel login

# 部署
vercel

# 跟隨指示選擇預設設定
```

### 方法 3：直接上傳

1. 去 https://vercel.com
2. Click "Add New..." → "Project"
3. 選擇 "From Dir" 
4. 上傳 `hair-salon` 資料夾

## 🌐 上線後的連結

部署完成後會獲得類似：
- `https://palace-hair-studio.vercel.app`

## 📱 功能

### 前端 (index.html)
- [x] 響應式設計 (手機/電腦)
- [x] 首頁 + 服務介紹
- [x] 髮型師介紹
- [x] 價目表
- [x] 線上預約表單
- [x] 聯絡資訊

### 預約系統
- [x] 選擇服務 (剪髮/染髮/燙髮/護髮)
- [x] 選擇髮型師
- [x] 選擇日期 (未來14日)
- [x] 選擇時段 (10:00-20:00)
- [x] 電話驗證
- [x] 防止重複預約
- [x] 預約成功顯示編號

### 後台 (admin.html)
- [x] 管理員登入
- [x] 統計儀表板
- [x] 預約列表
- [x] 搜尋/篩選

## 🔐 管理員登入

- **網址**: `你的網址/admin.html`
- **用戶名**: `admin`
- **密碼**: `palace2026`

## ⚠️ 重要說明

### 數據存儲
- **免費部署**: 數據存在瀏覽器 localStorage，Serverless 重啟會重置
- **解決方案**: 每個顧客的預約會存在自己的瀏覽器，後台需要手動輸入或接數據庫

### 生產環境建議
1. 接入 Vercel KV (Redis) 持久化數據
2. 接入 Supabase / Firebase 數據庫
3. 添加郵件通知
4. 添加 SMS 通知

## 📝 技術栈

- **前端**: HTML5, CSS3, Vanilla JavaScript
- **後端**: Vercel Serverless Functions
- **部署**: Vercel (免費)

## 📄 許可證

MIT License
