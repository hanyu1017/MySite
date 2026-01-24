# 個人照片設定

## 🚀 快速開始

### 方法 1：使用本地圖片（推薦，最快速）

1. **準備你的照片**
   - 建議尺寸：400x400px 或更大的正方形
   - 支援格式：JPG, PNG, WebP, SVG
   - 建議檔案大小：< 500KB

2. **放置照片**

   將照片命名為以下任一名稱並放在此目錄：
   - `avatar.jpg`
   - `avatar.png`
   - `avatar.webp`

   例如：
   ```
   public/images/profile/
   ├── avatar.jpg          ← 你的照片
   ├── default-avatar.svg  ← 預設頭像（不要刪除）
   └── README.md
   ```

3. **完成！**

   重新整理網頁，你的照片就會自動顯示。

---

### 方法 2：使用線上圖片 URL

如果你的照片已經放在其他地方（如 Imgur、Cloudinary 等）：

1. 登入管理後台：`/dashboard/profile`
2. 在「頭像網址」欄位輸入圖片 URL
3. 儲存

**注意：本地圖片優先級高於資料庫 URL**

---

## 📸 照片建議

### 最佳尺寸
- **正方形**：400x400px ~ 800x800px
- **長寬比**：1:1

### 格式選擇
- **WebP**：檔案最小，推薦使用
- **PNG**：支援透明背景
- **JPG**：一般照片
- **SVG**：向量圖形（如 logo）

### 壓縮工具
- [TinyPNG](https://tinypng.com/) - 線上壓縮
- [Squoosh](https://squoosh.app/) - Google 工具
- [ImageOptim](https://imageoptim.com/) - Mac 工具

---

## 🔧 進階設定

### 優先順序

系統會按照以下順序尋找圖片：

1. **本地圖片**
   - `/public/images/profile/avatar.jpg`
   - `/public/images/profile/avatar.png`
   - `/public/images/profile/avatar.webp`

2. **資料庫 URL**
   - 從資料庫 `Profile.avatar` 欄位載入

3. **預設頭像**
   - `/public/images/profile/default-avatar.svg`

### 修改預設頭像

如果你想自訂預設頭像，可以：
1. 替換 `default-avatar.svg`
2. 或創建新的 SVG 檔案

---

## ❓ 疑難排解

### 照片沒有顯示

1. **檢查檔案名稱**
   - 必須是 `avatar.jpg`、`avatar.png` 或 `avatar.webp`
   - 注意大小寫（建議全小寫）

2. **檢查檔案位置**
   ```
   ✅ public/images/profile/avatar.jpg
   ❌ public/profile/avatar.jpg
   ❌ public/images/avatar.jpg
   ```

3. **重啟開發服務器**
   ```bash
   # 按 Ctrl+C 停止
   npm run dev
   ```

4. **清除瀏覽器快取**
   - 按 `Ctrl + Shift + R` (Windows)
   - 按 `Cmd + Shift + R` (Mac)

### 照片載入慢

1. **壓縮圖片**
   - 使用 TinyPNG 或 Squoosh 壓縮
   - 目標檔案大小：< 200KB

2. **轉換格式**
   - 優先使用 WebP 格式
   - JPG 次之，PNG 最大

3. **調整尺寸**
   - 不要使用過大的圖片
   - 建議最大 800x800px

---

## 💡 提示

- ✅ 使用高品質的照片
- ✅ 確保照片光線充足
- ✅ 保持專業的形象
- ✅ 定期更新照片
- ❌ 不要使用模糊或像素化的圖片
- ❌ 不要使用版權受保護的圖片
