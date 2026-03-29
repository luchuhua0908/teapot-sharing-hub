# 紫砂壺分享平台 - 項目結構

## 📁 目錄結構

```
teapot_sharing_hub/
├── client/                          # 前端應用
│   ├── src/
│   │   ├── pages/                  # 頁面組件
│   │   │   ├── Home.tsx            # 首頁
│   │   │   ├── Upload.tsx          # 上傳紫砂壺頁面
│   │   │   ├── Explore.tsx         # 探索收藏頁面
│   │   │   ├── Classic.tsx         # 經典作品頁面
│   │   │   ├── Auction.tsx         # 拍賣會頁面
│   │   │   ├── Community.tsx       # 壺友社區頁面
│   │   │   ├── Admin.tsx           # 管理員後台
│   │   │   └── NotFound.tsx        # 404 頁面
│   │   ├── components/             # 可重用組件
│   │   │   ├── ui/                # shadcn/ui 組件庫
│   │   │   ├── DashboardLayout.tsx # 儀表板佈局
│   │   │   ├── AIChatBox.tsx      # AI 聊天框
│   │   │   ├── Map.tsx            # 地圖組件
│   │   │   └── ErrorBoundary.tsx  # 錯誤邊界
│   │   ├── contexts/              # React Context
│   │   │   └── ThemeContext.tsx   # 主題上下文
│   │   ├── hooks/                 # 自定義 Hooks
│   │   │   └── useAuth.ts         # 認證 Hook
│   │   ├── lib/
│   │   │   └── trpc.ts            # tRPC 客戶端配置
│   │   ├── App.tsx                # 路由和主應用
│   │   ├── main.tsx               # 應用入口
│   │   └── index.css              # 全局樣式
│   ├── public/                    # 靜態資源
│   ├── index.html                 # HTML 模板
│   └── vite.config.ts             # Vite 配置
│
├── server/                        # 後端服務
│   ├── routers.ts                # tRPC 路由定義
│   ├── db.ts                     # 數據庫查詢函數
│   ├── storage.ts                # S3 文件存儲
│   ├── teapot.test.ts            # 紫砂壺測試
│   ├── comment.test.ts           # 留言測試
│   ├── auth.logout.test.ts       # 認證測試
│   └── _core/                    # 核心框架
│       ├── index.ts              # 服務器入口
│       ├── context.ts            # tRPC 上下文
│       ├── trpc.ts               # tRPC 配置
│       ├── llm.ts                # LLM 集成
│       ├── voiceTranscription.ts # 語音轉文本
│       ├── imageGeneration.ts    # 圖像生成
│       ├── map.ts                # 地圖服務
│       ├── notification.ts       # 通知系統
│       ├── env.ts                # 環境變量
│       ├── cookies.ts            # Cookie 管理
│       └── systemRouter.ts       # 系統路由
│
├── drizzle/                      # 數據庫架構
│   ├── schema.ts                # 數據庫表定義
│   └── migrations/              # 數據庫遷移
│
├── shared/                       # 共享代碼
│   └── const.ts                 # 常量定義
│
├── storage/                      # 存儲配置
│   └── index.ts                 # S3 存儲函數
│
├── data/                         # 數據文件
│   └── classic_teapot_shapes.md # 經典器型數據
│
├── package.json                  # 項目依賴
├── tsconfig.json                # TypeScript 配置
├── tailwind.config.ts           # Tailwind CSS 配置
├── drizzle.config.ts            # Drizzle ORM 配置
├── vitest.config.ts             # Vitest 配置
├── todo.md                       # 項目待辦清單
└── README.md                     # 項目說明
```

## 🗄️ 數據庫表結構

### users
- 用戶認證和基本信息
- 字段：id, openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn

### teapots
- 用戶上傳的紫砂壺
- 字段：id, userId, name, description, clayType, claySubtype, craftType, shapeType, photos, status, aiAnalyzed, manualCorrected, createdAt, updatedAt

### classic_teapots
- 經典紫砂壺作品
- 字段：id, name, artist, dynasty, description, clayType, shapeType, photos, referenceUrl, createdAt

### auction_teapots
- 拍賣會紫砂壺
- 字段：id, name, artist, auctionHouse, auctionDate, estimatedPrice, finalPrice, description, clayType, shapeType, photos, sourceUrl, createdAt

### comments
- 壺友留言
- 字段：id, userId, teapotId, authorName, content, photos, status, reviewedBy, reviewNote, createdAt, updatedAt

### collections
- 用戶收藏
- 字段：id, userId, teapotId, notes, createdAt

## 🔑 核心功能模塊

### 1. 認證系統 (Authentication)
- Manus OAuth 集成
- 用戶會話管理
- 角色權限控制（user/admin）

### 2. 紫砂壺管理 (Teapot Management)
- 多角度照片上傳
- AI 泥料識別
- AI 工藝識別
- AI 器型識別
- 人工修正功能
- 審核流程

### 3. 內容展示 (Content Display)
- 經典作品圖文介紹
- 當代拍賣會作品
- 探索收藏頁面

### 4. 社區功能 (Community)
- 匿名留言
- 留言審核
- 評論管理

### 5. 文件存儲 (File Storage)
- S3 集成
- 圖片上傳和管理

## 🚀 技術棧

### 前端
- React 19
- TypeScript 5.9
- Tailwind CSS 4
- shadcn/ui
- tRPC 11
- Vite 7

### 後端
- Express 4
- tRPC 11
- Drizzle ORM
- MySQL/TiDB

### AI/ML
- LLM 集成（圖像識別）
- 語音轉文本
- 圖像生成

### 測試
- Vitest 2
- 21 個單元測試全部通過

## 📦 主要依賴

```json
{
  "@trpc/client": "^11.6.0",
  "@trpc/react-query": "^11.6.0",
  "@trpc/server": "^11.6.0",
  "react": "^19.2.1",
  "react-dom": "^19.2.1",
  "express": "^4.21.2",
  "drizzle-orm": "^0.44.5",
  "tailwindcss": "^4.1.14",
  "@radix-ui/*": "latest",
  "zod": "^4.1.12"
}
```

## 🔧 開發命令

```bash
# 安裝依賴
pnpm install

# 開發模式
pnpm dev

# 構建
pnpm build

# 生產運行
pnpm start

# 運行測試
pnpm test

# 數據庫遷移
pnpm db:push

# 代碼格式化
pnpm format

# 類型檢查
pnpm check
```

## 📝 環境變量

必需的環境變量（自動注入）：
- `DATABASE_URL` - 數據庫連接字符串
- `JWT_SECRET` - JWT 簽名密鑰
- `VITE_APP_ID` - OAuth 應用 ID
- `OAUTH_SERVER_URL` - OAuth 服務器 URL
- `BUILT_IN_FORGE_API_URL` - Manus API URL
- `BUILT_IN_FORGE_API_KEY` - Manus API 密鑰

## 🎨 設計特色

- **優雅完美風格**：紫砂文化主題配色
- **響應式設計**：支持移動端和桌面端
- **流暢交互**：現代化 UI/UX
- **無障礙訪問**：符合 WCAG 標準

## 📊 項目統計

- 前端頁面：8 個
- 後端路由：30+ 個
- 數據庫表：6 個
- 單元測試：21 個（100% 通過）
- 代碼行數：2000+ 行

## 🚢 部署

項目已配置在 Manus 平台上，可直接發布。支持自定義域名和 SSL 證書。

## 📞 支持

如有問題，請參考項目文檔或聯繫開發團隊。
