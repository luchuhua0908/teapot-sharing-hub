# Cloudflare Dashboard Git 集成部署指南

本指南介紹如何使用 Cloudflare Dashboard 的 Git 集成功能，實現從 GitHub 自動部署到 Cloudflare Workers。

## 📋 前置條件

- ✅ GitHub 倉庫已創建：`luchuhua0908/teapot-sharing-hub`
- ✅ 代碼已推送到 GitHub
- ✅ Cloudflare 帳號已創建
- ✅ 所有 GitHub Secrets 已配置

## 🚀 部署步驟

### 步驟 1：登錄 Cloudflare Dashboard

1. 打開 [Cloudflare Dashboard](https://dash.cloudflare.com/ )
2. 使用您的 Cloudflare 帳號登錄

### 步驟 2：進入 Workers 管理頁面

1. 在左側菜單中找到 **Workers & Pages**
2. 點擊 **Workers**

### 步驟 3：創建新的 Worker

1. 點擊 **Create application**
2. 選擇 **Create a Worker**
3. 給 Worker 命名：`teapot-sharing-hub`
4. 點擊 **Deploy**

### 步驟 4：連接 Git 倉庫

1. 在 Worker 詳情頁面，找到 **Deployments** 標籤
2. 點擊 **Connect a repository**
3. 選擇 **GitHub**
4. 授權 Cloudflare 訪問您的 GitHub 帳號
5. 選擇倉庫：`luchuhua0908/teapot-sharing-hub`

### 步驟 5：配置構建設置

1. 在 **Build settings** 中配置：
   - **Framework preset**: 選擇 `None`（因為我們使用自定義 wrangler.toml）
   - **Build command**: `pnpm install && pnpm build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`

2. 點擊 **Save and Deploy**

### 步驟 6：配置環境變數

1. 在 Worker 詳情頁面，找到 **Settings** 標籤
2. 點擊 **Environment** 或 **Variables**
3. 添加以下環境變數：

| 變數名 | 值 | 類型 |
|------|-----|------|
| `DATABASE_URL` | 從 GitHub Secrets 複製 | Secret |
| `JWT_SECRET` | 從 GitHub Secrets 複製 | Secret |
| `VITE_APP_ID` | 從 GitHub Secrets 複製 | Variable |
| `OAUTH_SERVER_URL` | `https://api.manus.im` | Variable |
| `BUILT_IN_FORGE_API_URL` | `https://forge.manus.ai` | Variable |
| `BUILT_IN_FORGE_API_KEY` | 從 GitHub Secrets 複製 | Secret |
| `VITE_FRONTEND_FORGE_API_KEY` | 從 GitHub Secrets 複製 | Secret |
| `VITE_FRONTEND_FORGE_API_URL` | `https://forge.manus.ai` | Variable |
| `NODE_ENV` | `production` | Variable |

### 步驟 7：配置部署觸發器

1. 在 **Deployments** 標籤中 ，找到 **Automatic deployments**
2. 選擇分支：`main`
3. 啟用自動部署

### 步驟 8：驗證部署

1. 推送代碼到 GitHub：
\`\`\`bash
git push origin main
\`\`\`

2. 在 Cloudflare Dashboard 中監控部署進度
3. 部署完成後，您可以在以下 URL 訪問應用：
\`\`\`
https://teapot-sharing-hub.{your-account}.workers.dev
\`\`\`

## 🔗 自定義域名（可選 ）

1. 在 Worker 詳情頁面，找到 **Triggers** 標籤
2. 點擊 **Add Custom Domain**
3. 輸入您的域名（例如：`teapot.example.com`）
4. 按照提示配置 DNS 記錄

## 📊 監控部署

### 查看部署日誌

1. 在 Worker 詳情頁面，找到 **Deployments** 標籤
2. 點擊最新的部署記錄
3. 查看構建和部署日誌

### 查看實時日誌

1. 在 Worker 詳情頁面，找到 **Logs** 標籤
2. 查看實時的請求和錯誤日誌

## 🐛 故障排除

### 部署失敗

**常見原因：**
- ❌ 環境變數配置不完整
- ❌ 構建命令失敗
- ❌ 依賴安裝失敗

**解決方案：**
1. 檢查 Cloudflare Dashboard 中的構建日誌
2. 確認所有環境變數都已正確配置
3. 在本地運行 \`pnpm build\` 驗證構建是否成功

### 應用無法訪問

**常見原因：**
- ❌ Worker 未正確部署
- ❌ 路由配置錯誤
- ❌ 環境變數缺失導致應用崩潰

**解決方案：**
1. 檢查 Cloudflare Dashboard 中的 Worker 狀態
2. 查看實時日誌，查找錯誤信息
3. 驗證 wrangler.toml 中的路由配置

## 💡 最佳實踐

1. **使用環境變數** - 不要在代碼中硬編碼敏感信息
2. **監控日誌** - 定期檢查 Cloudflare 日誌，及時發現問題
3. **測試部署** - 在推送到 main 分支前，先在開發分支測試
4. **版本控制** - 使用 Git 標籤標記重要的部署版本

## 🔄 回滾部署

如果部署出現問題，可以回滾到之前的版本：

1. 在 **Deployments** 標籤中，找到之前的部署記錄
2. 點擊 **Rollback**
3. 確認回滾

## 📞 獲取幫助

- [Cloudflare Workers 文檔](https://developers.cloudflare.com/workers/ )
- [Cloudflare Git 集成文檔](https://developers.cloudflare.com/workers/ci-cd/git-integration/ )
- [Cloudflare 社區論壇](https://community.cloudflare.com/ )
