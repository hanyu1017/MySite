# MySite - 個人作品集網站

一個功能完整的全端個人作品集網站，具有認證系統、專案展示和用戶行為分析功能。

## 功能特色

- ✨ **瀑布式設計** - 流暢的滾動體驗，適應手機和電腦版
- 🔐 **認證系統** - 基於 NextAuth.js 的安全登入系統
- 📊 **分析追蹤** - 自建的用戶行為分析系統
- 🎨 **響應式設計** - 完美適配各種設備尺寸
- 🚀 **專案展示** - 動態載入的專案作品集
- 👤 **個人資料** - 展示學習歷程、技能和經驗
- 🔒 **權限管理** - ADMIN 和 VISITOR 兩種角色

## 技術棧

- **前端**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **後端**: Next.js API Routes
- **資料庫**: PostgreSQL with Prisma ORM
- **認證**: NextAuth.js
- **分析**: 自建分析系統
- **部署**: Railway

## 快速開始

### 環境要求

- Node.js 18+
- PostgreSQL 14+
- npm 或 yarn

### 安裝步驟

1. **克隆專案**
```bash
git clone <your-repo-url>
cd MySite
```

2. **安裝依賴**
```bash
npm install
```

3. **配置環境變數**
```bash
cp .env.example .env
```

編輯 `.env` 文件並填入以下資訊：
```env
DATABASE_URL="postgresql://username:password@localhost:5432/mysite"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"  # 使用 openssl rand -base64 32 生成
ADMIN_EMAIL="your-email@example.com"
```

4. **初始化資料庫**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **啟動開發伺服器**
```bash
npm run dev
```

訪問 http://localhost:3000

### 預設帳號

種子數據會創建以下管理員帳號：
- **Email**: admin@example.com (或您在 ADMIN_EMAIL 中設置的郵箱)
- **Password**: admin123

**⚠️ 請在生產環境中立即更改此密碼！**

## 資料庫結構

### User (用戶)
- 認證和授權
- 支援 ADMIN 和 VISITOR 角色

### Project (專案)
- 專案標題、描述、內容
- 標籤、縮圖、連結
- 發布狀態和排序

### Profile (個人資料)
- 基本資訊、技能
- 學習歷程、工作經驗
- 社交媒體連結

### Analytics (分析)
- 事件追蹤 (page_view, project_click, link_click 等)
- 用戶代理和 IP 地址
- 自定義元數據

## 部署到 Railway

### 方法 1: 使用 Railway CLI

1. **安裝 Railway CLI**
```bash
npm install -g @railway/cli
```

2. **登入 Railway**
```bash
railway login
```

3. **初始化專案**
```bash
railway init
```

4. **添加 PostgreSQL**
```bash
railway add
# 選擇 PostgreSQL
```

5. **設置環境變數**
```bash
railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables set NEXTAUTH_URL=https://your-domain.railway.app
railway variables set ADMIN_EMAIL=your-email@example.com
```

6. **部署**
```bash
railway up
```

7. **運行資料庫遷移**
```bash
railway run npx prisma db push
railway run npx prisma db seed
```

### 方法 2: 使用 GitHub 整合

1. 將代碼推送到 GitHub
2. 前往 [Railway](https://railway.app)
3. 點擊 "New Project"
4. 選擇 "Deploy from GitHub repo"
5. 選擇您的倉庫
6. 添加 PostgreSQL 服務
7. 設置環境變數（同上）
8. Railway 會自動部署

### 重要環境變數

在 Railway 中設置以下變數：

```
DATABASE_URL          # 自動由 PostgreSQL 服務提供
NEXTAUTH_URL          # https://your-domain.railway.app
NEXTAUTH_SECRET       # 生成的密鑰
ADMIN_EMAIL           # 管理員郵箱
```

## 使用指南

### 管理專案

登入管理員帳號後：

1. 訪問 `/dashboard/analytics` 查看分析數據
2. 使用 API 端點管理專案：
   - `POST /api/projects` - 創建專案
   - `PUT /api/projects/[id]` - 更新專案
   - `DELETE /api/projects/[id]` - 刪除專案

### 更新個人資料

使用 `PUT /api/profile` 端點更新您的個人資料。

### 查看分析

登入後訪問 `/dashboard/analytics` 查看：
- 頁面瀏覽統計
- 唯一訪客數
- 熱門頁面和事件
- 每日事件趨勢

## 開發指令

```bash
# 開發模式
npm run dev

# 建構生產版本
npm run build

# 啟動生產伺服器
npm start

# 運行 Prisma Studio
npx prisma studio

# 創建新的管理員帳號
npx tsx scripts/create-admin.ts
```

## 自定義

### 修改顏色主題

編輯 `tailwind.config.ts` 中的顏色配置。

### 添加新頁面

在 `src/app` 目錄下創建新的路由文件夾。

### 修改個人資料

編輯資料庫中的 Profile 記錄，或使用 API 更新。

## 安全建議

1. **更改預設密碼** - 立即更改種子數據中的管理員密碼
2. **使用強密鑰** - 為 NEXTAUTH_SECRET 生成強隨機密鑰
3. **限制訪問** - 在生產環境中考慮添加 IP 白名單
4. **HTTPS** - 確保在生產環境中使用 HTTPS
5. **環境變數** - 永遠不要將 `.env` 文件提交到 Git

## 常見問題

### 如何創建新的管理員帳號？

```bash
npx tsx scripts/create-admin.ts
```

### 資料庫連接失敗？

檢查 `DATABASE_URL` 環境變數是否正確設置。

### Railway 部署失敗？

確保已設置所有必需的環境變數，並運行了資料庫遷移。

## 授權

MIT License

## 聯絡

如有問題或建議，請開 issue 或聯絡 [your@email.com]

---

**祝您使用愉快！** 🎉