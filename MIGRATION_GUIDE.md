# Session Tracking Migration Guide

本指南說明如何執行資料庫 migration 以啟用短網址點擊後的完整使用者旅程追蹤功能。

## 功能說明

新的 Session Tracking 系統將能夠：
1. 追蹤短網址點擊事件
2. 在 cookie 中儲存唯一的 session ID
3. 將點擊後的所有操作（頁面瀏覽、專案點擊等）關聯到原始的短網址點擊
4. 在管理介面中顯示完整的使用者旅程

## 資料庫變更

### LinkClick 表
- 新增 `sessionId` 欄位（TEXT, UNIQUE）：唯一識別每次點擊的 session
- 新增索引：`sessionId`

### Analytics 表
- 新增 `linkClickId` 欄位（TEXT, 可為 NULL）：關聯到 LinkClick 表
- 新增外鍵約束：關聯到 LinkClick.id
- 新增索引：`linkClickId`

## 執行 Migration

### 方法一：使用 Prisma Migrate（推薦）

```bash
# 1. 執行 migration
npx prisma migrate deploy

# 2. 重新生成 Prisma Client
npx prisma generate
```

### 方法二：手動執行 SQL

如果 Prisma migrate 無法使用，可以手動執行以下 SQL：

```sql
-- 1. 在 LinkClick 表添加 sessionId 欄位
ALTER TABLE "LinkClick" ADD COLUMN "sessionId" TEXT;

-- 2. 為現有記錄生成唯一的 sessionId
UPDATE "LinkClick"
SET "sessionId" = "id" || '-' || EXTRACT(EPOCH FROM "createdAt")::TEXT
WHERE "sessionId" IS NULL;

-- 3. 設置 sessionId 為 NOT NULL 並添加唯一約束
ALTER TABLE "LinkClick" ALTER COLUMN "sessionId" SET NOT NULL;
CREATE UNIQUE INDEX "LinkClick_sessionId_key" ON "LinkClick"("sessionId");

-- 4. 添加索引
CREATE INDEX "LinkClick_sessionId_idx" ON "LinkClick"("sessionId");

-- 5. 在 Analytics 表添加 linkClickId 欄位
ALTER TABLE "Analytics" ADD COLUMN "linkClickId" TEXT;

-- 6. 添加外鍵約束
ALTER TABLE "Analytics"
ADD CONSTRAINT "Analytics_linkClickId_fkey"
FOREIGN KEY ("linkClickId") REFERENCES "LinkClick"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- 7. 添加索引
CREATE INDEX "Analytics_linkClickId_idx" ON "Analytics"("linkClickId");
```

### 方法三：使用 Prisma DB Push（開發環境）

```bash
# 警告：此方法會重置資料庫，僅適用於開發環境
npx prisma db push
```

## 驗證 Migration

執行完 migration 後，確認以下事項：

### 1. 檢查資料表結構

```sql
-- 檢查 LinkClick 表
\d "LinkClick"

-- 檢查 Analytics 表
\d "Analytics"
```

### 2. 測試功能

1. 訪問管理後台：`/dashboard/links`
2. 創建一個新的追蹤連結
3. 點擊該短網址（`/l/your-slug`）
4. 在重定向後的頁面進行一些操作（瀏覽頁面、點擊專案等）
5. 返回管理後台，點擊「查看旅程」按鈕
6. 應該能看到完整的使用者旅程，包括初始點擊和後續操作

### 3. 檢查 Cookie

使用瀏覽器開發者工具檢查是否設置了 `_track_session` cookie。

## 回滾 Migration

如果需要回滾到之前的狀態：

```sql
-- 1. 刪除外鍵約束
ALTER TABLE "Analytics" DROP CONSTRAINT "Analytics_linkClickId_fkey";

-- 2. 刪除索引
DROP INDEX "Analytics_linkClickId_idx";
DROP INDEX "LinkClick_sessionId_idx";
DROP INDEX "LinkClick_sessionId_key";

-- 3. 刪除欄位
ALTER TABLE "Analytics" DROP COLUMN "linkClickId";
ALTER TABLE "LinkClick" DROP COLUMN "sessionId";
```

## 疑難排解

### Prisma 引擎下載失敗

如果遇到 Prisma 引擎下載 403 錯誤：

```bash
# 設置環境變數忽略 checksum 錯誤
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# 然後重新執行 migration
npx prisma migrate deploy
```

### 資料庫連接錯誤

確保 `.env` 文件中的 `DATABASE_URL` 設置正確：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

## 相關檔案

- **Schema**: `prisma/schema.prisma`
- **Migration SQL**: `prisma/migrations/*/migration.sql`
- **短網址重定向**: `src/app/l/[slug]/route.ts`
- **分析追蹤**: `src/lib/analytics.ts`, `src/components/analytics/AnalyticsTracker.tsx`
- **管理介面**: `src/app/(dashboard)/dashboard/links/page.tsx`

## 支援

如有問題，請檢查：
1. Prisma 文檔：https://www.prisma.io/docs
2. PostgreSQL 日誌
3. Next.js 開發服務器日誌
