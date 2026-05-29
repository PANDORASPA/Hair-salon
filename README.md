# PANDORA HEAD SPA

PANDORA HEAD SPA 是一個頭皮護理中心網站，包含前台預約、會員中心、套票購買與扣次、Stripe 付款、產品訂單，以及後台營運管理。網站定位為「PANDORA HEAD SPA｜全自助頭皮護理中心」，用作替代 Palace Hair Spa 舊網站的正式新站。

## 目前功能範圍

- 前台頁面：首頁、頭皮護理服務、套票、產品、團隊、文章、FAQ、預約入口。
- 會員功能：Supabase Auth 登入 / 註冊、會員資料、會員預約、訂單、持有套票與扣次紀錄。
- 後端流程：可預約時段、建立預約、產品訂單、套票購買、Stripe Checkout、Stripe webhook 發放套票、人工確認付款、舊套票 CSV 匯入。
- 後台管理：預約、會員、服務、人員、套票、訂單、交易、庫存、優惠碼、文章、FAQ、設定中心、安全紀錄、套票付款確認與 CSV 匯入。

## 本機開發

1. 安裝套件。

```bash
npm install
```

2. 複製 `.env.example` 成 `.env.local`。

3. 填入必要環境變數：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_CURRENCY`，預設為 `hkd`
- 如正式上線要跨 instance rate limit，另填 `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`

4. 依檔名順序套用 [`supabase/migrations`](./supabase/migrations) 內的 migration。

5. 如需本機示範資料，可執行 [`supabase/seed.sql`](./supabase/seed.sql)。

6. 啟動開發伺服器。

```bash
npm run dev
```

7. 上線前建議至少跑一次：

```bash
npm run build
npm run security:scan
```

## 權限模型

- 會員身份以 Supabase Auth session 為準。
- `member_profiles` 是會員資料延伸表。
- `/account` 和 `/admin` 都以 server session / middleware 保護，不以 browser localStorage 作權限來源。
- 管理員權限由 `member_profiles.is_admin` 與資料庫 policy 判斷。

## 核心流程

### 預約

- 可預約時段與建立預約都經 server route。
- 會員可在預約時選擇有效的 `user_tickets` 套票，金額會變成 `$0`，並扣 1 次。
- 套票扣次與取消回補會寫入 `ticket_redemptions` ledger。

### 訂單與 Stripe

- 產品結賬使用 `/api/orders/create`。
- 套票購買使用 `/api/tickets/purchase`。
- Stripe env 完成後，產品和套票可使用 Stripe Checkout。
- Stripe webhook endpoint 是 `/api/stripe/webhook`；套票付款成功後會自動建立 `user_tickets` 並寫入 `ticket_redemptions`。
- 人工確認付款保留作後備，但只可由 admin route 發放套票。

### 套票

- 前台與後台統一顯示為「套票」。
- `tickets` 儲存套票模板。
- `user_tickets` 儲存會員持有套票與餘額。
- `ticket_redemptions` 是不可變使用紀錄，記錄發放、扣次和回補。

## Supabase 設定

正式 schema 以 [`supabase/migrations`](./supabase/migrations) 為準。

全新環境檢查：

1. 建立或重設 Supabase project。
2. 依檔名順序套用 `supabase/migrations`。
3. 如需要示範內容，執行 `supabase/seed.sql`。
4. 透過網站建立第一個會員。
5. 在 `member_profiles` 將正式管理員設為 `is_admin = true`。
6. 驗證前台、會員中心、預約、訂單、套票、Stripe webhook 和 `/admin`。

舊 SQL 檔只作歷史參考；`sql-fix-permissions.sql` 屬緊急修復腳本，不應作為全新安裝流程。

## 上線驗收

正式上線前至少確認：

1. 新會員註冊後會建立 `member_profiles`。
2. 登入後 `/account` 顯示會員資料。
3. 頭皮護理預約可建立並顯示在會員預約。
4. Stripe test card 購買套票後，webhook 會發放 `user_tickets`。
5. 人工付款套票保持 `awaiting_payment`，直到 admin 確認才發放。
6. 使用套票預約會扣 1 次。
7. 取消使用套票的預約會回補 1 次。
8. Admin 確認付款會建立正確的會員套票。
9. 產品訂單 Stripe 成功後會轉為完成狀態。
10. Admin 帳號可以進入 `/admin`。
11. 普通會員不能進入 `/admin`。
12. `npm run build`、`npm run security:scan`、`npm audit --production` 全部通過。

Palace Hair Spa 替代驗收請見 [`PALACEHAIRSPA_REPLACEMENT_ACCEPTANCE.md`](./PALACEHAIRSPA_REPLACEMENT_ACCEPTANCE.md)。

## 待業主確認

- 正式地址、電話、WhatsApp、Google Map、社交平台連結。
- 正式服務價目、套票條款、產品內容、護理師資料、FAQ、文章內容。
- Stripe live key、webhook secret、Vercel env、正式網域與 DNS 切換時間。

## License

MIT
