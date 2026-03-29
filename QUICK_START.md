# 紫砂壺分享平台 - 快速開始指南

## 📋 前置要求

- Node.js 22.13.0+
- pnpm 10.4.1+
- MySQL 8.0+ 或 TiDB

## 🚀 快速開始

### 1. 安裝依賴

```bash
cd teapot_sharing_hub
pnpm install
```

### 2. 配置環境變量

在項目根目錄創建 `.env.local` 文件，添加以下變量：

```env
DATABASE_URL=mysql://user:password@localhost:3306/teapot_sharing_hub
JWT_SECRET=your-secret-key-here
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
```

### 3. 初始化數據庫

```bash
pnpm db:push
```

### 4. 啟動開發服務器

```bash
pnpm dev
```

訪問 `http://localhost:3000` 查看應用。

## 📁 項目結構

```
client/              # React 前端應用
server/              # Express 後端服務
drizzle/             # 數據庫架構
shared/              # 共享代碼
storage/             # S3 存儲配置
```

## 🔧 常用命令

| 命令 | 說明 |
|------|------|
| `pnpm dev` | 啟動開發服務器 |
| `pnpm build` | 構建生產版本 |
| `pnpm start` | 運行生產版本 |
| `pnpm test` | 運行單元測試 |
| `pnpm db:push` | 推送數據庫遷移 |
| `pnpm format` | 格式化代碼 |
| `pnpm check` | 類型檢查 |

## 📱 主要功能

### 用戶功能
- ✅ 註冊和登錄（Manus OAuth）
- ✅ 上傳紫砂壺照片（多角度）
- ✅ AI 識別泥料、工藝、器型
- ✅ 人工修正識別結果
- ✅ 瀏覽經典作品
- ✅ 查看拍賣會信息
- ✅ 留言評論
- ✅ 管理個人收藏

### 管理員功能
- ✅ 審核用戶上傳的壺
- ✅ 審核留言評論
- ✅ 管理經典作品
- ✅ 管理拍賣會數據

## 🎨 設計特色

- **優雅完美風格** - 紫砂文化主題配色
- **響應式設計** - 支持移動端和桌面端
- **流暢交互** - 現代化 UI/UX
- **AI 驅動** - 智能識別功能

## 🧪 測試

運行所有測試：

```bash
pnpm test
```

測試覆蓋：
- 用戶認證
- 紫砂壺管理
- 留言審核
- 權限控制

## 📊 API 文檔

### tRPC 路由

#### 認證 (auth)
- `auth.me` - 獲取當前用戶信息
- `auth.logout` - 登出用戶

#### 紫砂壺 (teapot)
- `teapot.create` - 創建新壺
- `teapot.getById` - 獲取壺詳情
- `teapot.getPublic` - 獲取公開壺列表
- `teapot.analyzeClay` - AI 識別泥料
- `teapot.analyzeCraft` - AI 識別工藝
- `teapot.analyzeShape` - AI 識別器型
- `teapot.update` - 更新壺信息
- `teapot.approve` - 審核壺（管理員）

#### 留言 (comment)
- `comment.create` - 創建留言
- `comment.getApproved` - 獲取已批准留言
- `comment.getPending` - 獲取待審核留言（管理員）
- `comment.review` - 審核留言（管理員）

#### 經典作品 (classic)
- `classic.getAll` - 獲取所有經典作品
- `classic.getById` - 獲取經典作品詳情
- `classic.create` - 創建經典作品（管理員）

#### 拍賣會 (auction)
- `auction.getAll` - 獲取所有拍賣會作品
- `auction.create` - 創建拍賣會作品（管理員）

#### 收藏 (collection)
- `collection.add` - 添加到收藏
- `collection.getMy` - 獲取我的收藏
- `collection.remove` - 移除收藏

## 🐛 故障排除

### 數據庫連接失敗
- 檢查 `DATABASE_URL` 是否正確
- 確保數據庫服務正在運行
- 檢查防火牆設置

### 構建失敗
```bash
# 清除緩存並重新安裝
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 測試失敗
```bash
# 運行特定測試
pnpm test teapot.test.ts
```

## 📚 進階配置

### 自定義 Tailwind 主題

編輯 `client/src/index.css` 修改顏色變量：

```css
@theme {
  --color-primary: #8B4513;
  --color-secondary: #D2B48C;
}
```

### 添加新的 tRPC 路由

1. 在 `server/routers.ts` 中定義新路由
2. 在 `server/db.ts` 中添加數據庫查詢
3. 在前端使用 `trpc.*.useQuery/useMutation`

### 環境特定配置

創建 `.env.development` 和 `.env.production` 文件用於不同環境。

## 🚢 部署

### 部署到 Manus 平台

1. 確保所有測試通過
2. 創建檢查點
3. 點擊管理界面的 "Publish" 按鈕

### 部署到其他平台

項目可部署到任何支持 Node.js 的平台：
- Vercel
- Railway
- Render
- AWS
- Google Cloud

## 📞 支持和反饋

- 查看項目文檔：`README.md`
- 查看項目結構：`PROJECT_STRUCTURE.md`
- 查看待辦清單：`todo.md`

## 📄 許可證

MIT License
