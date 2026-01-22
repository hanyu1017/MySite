# 項目架構說明

## 項目概述

這是一個完整的個人作品集網站，具有以下核心功能：

1. **瀑布式首頁** - 流暢的滾動體驗，包含關於我、專案展示和聯絡方式
2. **認證系統** - 安全的登入機制，支援管理員和訪客角色
3. **專案管理** - CRUD 操作管理您的專案作品
4. **分析系統** - 追蹤用戶行為和網站統計
5. **響應式設計** - 完美適配手機和電腦

## 目錄結構

```
MySite/
├── prisma/
│   ├── schema.prisma          # 資料庫模型定義
│   └── seed.ts                # 種子數據腳本
├── public/
│   └── images/                # 靜態圖片資源
├── scripts/
│   └── create-admin.ts        # 創建管理員腳本
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # 認證相關頁面
│   │   │   └── login/        # 登入頁面
│   │   ├── (dashboard)/      # 儀表板頁面
│   │   │   └── dashboard/
│   │   │       └── analytics/ # 分析頁面
│   │   ├── api/              # API 路由
│   │   │   ├── auth/         # 認證 API
│   │   │   ├── projects/     # 專案 API
│   │   │   ├── analytics/    # 分析 API
│   │   │   └── profile/      # 個人資料 API
│   │   ├── globals.css       # 全局樣式
│   │   ├── layout.tsx        # 根布局
│   │   ├── page.tsx          # 首頁
│   │   └── providers.tsx     # Context Providers
│   ├── components/
│   │   ├── analytics/        # 分析組件
│   │   │   └── AnalyticsTracker.tsx
│   │   ├── layout/           # 布局組件
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── projects/         # 專案組件
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectGrid.tsx
│   │   └── ui/               # UI 組件
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   ├── lib/                  # 工具函數
│   │   ├── auth.ts           # 認證邏輯
│   │   ├── analytics.ts      # 分析邏輯
│   │   └── db.ts             # 資料庫連接
│   ├── types/                # TypeScript 類型
│   │   └── index.ts
│   └── middleware.ts         # Next.js 中間件
├── .env.example              # 環境變數範例
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── railway.json              # Railway 配置
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 核心功能詳解

### 1. 認證系統

**技術**: NextAuth.js + JWT

- 位置: `src/app/api/auth/[...nextauth]/route.ts`
- 功能:
  - 基於憑證的登入
  - JWT session 管理
  - 角色權限控制 (ADMIN/VISITOR)
- 中間件保護: `src/middleware.ts` 保護 `/dashboard` 路由

### 2. 分析追蹤系統

**實現**: 自建事件追蹤系統

- 客戶端: `AnalyticsTracker.tsx` 自動追蹤頁面瀏覽
- API: `src/app/api/analytics/route.ts`
- 追蹤事件類型:
  - `page_view`: 頁面瀏覽
  - `project_click`: 專案點擊
  - `link_click`: 連結點擊
- 記錄數據:
  - IP 地址
  - User Agent
  - 自定義元數據

### 3. 專案管理

**CRUD API**: `src/app/api/projects/`

- `GET /api/projects` - 獲取專案列表
- `POST /api/projects` - 創建專案 (需管理員)
- `GET /api/projects/[id]` - 獲取單個專案
- `PUT /api/projects/[id]` - 更新專案 (需管理員)
- `DELETE /api/projects/[id]` - 刪除專案 (需管理員)

### 4. 個人資料

**API**: `src/app/api/profile/route.ts`

- `GET /api/profile` - 獲取個人資料 (公開)
- `PUT /api/profile` - 更新個人資料 (需管理員)

包含:
- 基本資訊 (名字、職稱、簡介)
- 技能列表
- 學習歷程
- 工作經驗
- 社交媒體連結

### 5. 資料庫設計

**使用**: PostgreSQL + Prisma ORM

主要模型:

1. **User** - 用戶資料
   - id, email, password, name, role
   - 關聯: sessions, analytics

2. **Project** - 專案資料
   - title, description, content
   - thumbnail, tags, githubUrl, liveUrl
   - published, order

3. **Profile** - 個人資料
   - name, title, bio, avatar
   - skills, education, experience
   - 社交媒體連結

4. **Analytics** - 分析數據
   - event, page, target, metadata
   - userAgent, ipAddress
   - 關聯: user

5. **Session** - 會話管理
   - token, expiresAt
   - 關聯: user

## 開發工作流

### 本地開發

```bash
# 1. 安裝依賴
npm install

# 2. 設置環境變數
cp .env.example .env
# 編輯 .env 並填入資料庫連接

# 3. 初始化資料庫
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. 啟動開發伺服器
npm run dev
```

### 添加新專案

1. 登入管理員帳號
2. 使用 POST `/api/projects` 創建專案:

```json
{
  "title": "專案標題",
  "description": "簡短描述",
  "content": "詳細內容",
  "tags": ["React", "TypeScript"],
  "githubUrl": "https://github.com/...",
  "liveUrl": "https://...",
  "published": true
}
```

### 更新個人資料

使用 PUT `/api/profile`:

```json
{
  "name": "您的名字",
  "title": "職稱",
  "bio": "個人簡介",
  "skills": ["JavaScript", "Python"],
  "education": [
    {
      "school": "某某大學",
      "degree": "學士",
      "year": "2018-2022"
    }
  ],
  "experience": [
    {
      "company": "某某公司",
      "position": "工程師",
      "period": "2022-現在"
    }
  ],
  "email": "your@email.com",
  "github": "https://github.com/username",
  "linkedin": "https://linkedin.com/in/username"
}
```

## 部署到 Railway

### 步驟

1. **推送代碼到 GitHub**

2. **在 Railway 創建新項目**
   - 連接 GitHub 倉庫
   - 添加 PostgreSQL 服務

3. **設置環境變數**
   ```
   NEXTAUTH_URL=https://your-domain.railway.app
   NEXTAUTH_SECRET=<生成的密鑰>
   ADMIN_EMAIL=your-email@example.com
   ```

4. **部署後運行遷移**
   ```bash
   railway run npx prisma db push
   railway run npx prisma db seed
   ```

5. **訪問網站並登入**
   - 使用種子數據創建的管理員帳號登入

## 自定義指南

### 更改顏色主題

編輯 `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    },
  },
}
```

### 添加新的追蹤事件

在任何組件中使用:

```typescript
import { trackEvent } from '@/components/analytics/AnalyticsTracker'

trackEvent('custom_event', '/page', 'target', { key: 'value' })
```

### 添加新的 API 端點

在 `src/app/api/` 下創建新文件夾:

```typescript
// src/app/api/your-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 您的邏輯
  return NextResponse.json({ data: 'result' })
}
```

## 安全考慮

1. **密碼哈希**: 使用 bcrypt (12 rounds)
2. **JWT**: 使用強隨機密鑰
3. **CORS**: Next.js 預設保護
4. **SQL 注入**: Prisma 提供保護
5. **XSS**: React 預設轉義
6. **CSRF**: NextAuth 提供保護

## 性能優化

1. **圖片優化**: 使用 Next.js Image 組件
2. **代碼分割**: Next.js 自動處理
3. **延遲載入**: 使用 Intersection Observer
4. **資料庫索引**: 已在 schema 中定義
5. **緩存**: API 可以添加 cache headers

## 疑難排解

### Prisma 錯誤

```bash
# 重新生成客戶端
npx prisma generate

# 重置資料庫
npx prisma db push --force-reset
```

### NextAuth 錯誤

檢查:
- NEXTAUTH_URL 是否正確
- NEXTAUTH_SECRET 是否已設置
- 資料庫連接是否正常

### 部署錯誤

確保:
- 所有環境變數已設置
- 資料庫遷移已運行
- Node.js 版本符合要求

## 下一步

1. **添加圖片上傳**: 整合 Cloudinary 或 AWS S3
2. **郵件通知**: 整合 SendGrid 或 Resend
3. **SEO 優化**: 添加 metadata 和 sitemap
4. **國際化**: 使用 next-intl
5. **測試**: 添加 Jest 和 Playwright

---

如有問題，請查閱 README.md 或開 issue。
