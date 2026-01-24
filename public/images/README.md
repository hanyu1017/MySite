# 圖片資源目錄

此目錄用於存放網站的靜態圖片資源。

## 目錄結構

```
public/images/
├── profile/          # 個人資料照片
│   ├── default-avatar.svg    # 預設頭像
│   └── avatar.jpg/png        # 你的個人照片（請自行添加）
├── projects/         # 專案相關圖片
└── general/          # 其他通用圖片
```

## 如何添加個人照片

### 方法 1：替換預設頭像（推薦）

1. 準備你的個人照片（建議尺寸：400x400px 或更大的正方形）
2. 將照片重命名為 `avatar.jpg` 或 `avatar.png`
3. 放入 `public/images/profile/` 目錄
4. 系統會自動使用你的照片

支援的格式：
- JPG/JPEG
- PNG
- WebP
- SVG

### 方法 2：透過資料庫設定

如果你已經有線上圖片 URL：

1. 登入管理後台：`/dashboard/profile`
2. 在「頭像網址」欄位輸入圖片 URL
3. 儲存設定

**注意：本地圖片優先級高於資料庫 URL**

## 圖片優化建議

為了獲得最佳載入速度：

1. **尺寸**：400x400px 到 800x800px 之間
2. **格式**：
   - WebP（推薦，檔案最小）
   - PNG（支援透明背景）
   - JPG（照片類圖片）
3. **檔案大小**：建議小於 500KB
4. **壓縮工具**：
   - [TinyPNG](https://tinypng.com/) - 線上壓縮
   - [Squoosh](https://squoosh.app/) - Google 壓縮工具

## Next.js Image 優化

所有透過 `<Image>` 元件載入的圖片都會自動：
- ✅ 延遲載入（lazy loading）
- ✅ 自動格式轉換（WebP）
- ✅ 響應式尺寸調整
- ✅ 快取優化

## 專案圖片

如需為專案添加縮圖：

1. 在 `public/images/projects/` 目錄添加圖片
2. 在資料庫中設定專案的 `imageUrl` 為 `/images/projects/your-image.jpg`
3. 或使用外部 URL

## 路徑使用方式

### 在 JSX 中使用

```jsx
import Image from 'next/image'

// 本地圖片
<Image
  src="/images/profile/avatar.jpg"
  alt="個人照片"
  width={400}
  height={400}
/>

// 外部圖片
<Image
  src="https://example.com/image.jpg"
  alt="外部圖片"
  width={400}
  height={400}
/>
```

### 在 CSS 中使用

```css
.avatar {
  background-image: url('/images/profile/avatar.jpg');
}
```

## 疑難排解

### 圖片無法顯示

1. 檢查檔案路徑是否正確
2. 檢查檔案名稱是否完全一致（包含大小寫）
3. 確認檔案格式是否支援
4. 重啟開發服務器：`npm run dev`

### 圖片載入慢

1. 壓縮圖片檔案
2. 轉換為 WebP 格式
3. 使用 CDN（生產環境）
4. 確認使用了 Next.js `<Image>` 元件

## 安全性

- ❌ 不要上傳敏感或私密圖片
- ❌ 不要上傳版權受保護的圖片
- ✅ 確保圖片內容適當且合法
- ✅ 定期清理不使用的圖片
