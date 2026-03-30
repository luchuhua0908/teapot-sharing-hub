# Cloudflare Workers 部署指南

本指南將幫助您將紫砂壺分享平台部署到 Cloudflare Workers。

## 📋 前置要求

1. **Cloudflare 帳戶** - 訪問 https://dash.cloudflare.com
2. **GitHub 帳戶** - 代碼已推送到 GitHub
3. **Node.js 22.x** - 本地開發環境
4. **pnpm** - 包管理工具
5. **wrangler CLI** - Cloudflare 命令行工具

## 🚀 部署步驟

### 第 1 步：安裝 wrangler CLI

```bash
npm install -g wrangler
```

### 第 2 步：認證 Cloudflare 帳戶

```bash
wrangler login
```

這會打開瀏覽器進行授權。完成後，您的認證信息將被保存。

### 第 3 步：配置 Cloudflare Secrets

在部署前，需要設置所有必需的環境變量：

```bash
# 設置數據庫連接
wrangler secret put DATABASE_URL --env production

# 設置 JWT 密鑰
wrangler secret put JWT_SECRET --env production

# 設置應用 ID
wrangler secret put VITE_APP_ID --env production

# 設置 OAuth 服務器 URL
wrangler secret put OAUTH_SERVER_URL --env production

# 設置 Forge API URL
wrangler secret put BUILT_IN_FORGE_API_URL --env production

# 設置 Forge API 密鑰
wrangler secret put BUILT_IN_FORGE_API_KEY --env production

# 設置前端 Forge API 密鑰
wrangler secret put VITE_FRONTEND_FORGE_API_KEY --env production

# 設置前端 Forge API URL
wrangler secret put VITE_FRONTEND_FORGE_API_URL --env production
```

### 第 4 步：本地測試

```bash
# 安裝依賴
pnpm install

# 構建應用
pnpm build

# 本地運行 wrangler
wrangler dev
```

訪問 `http://localhost:8787` 測試應用。

### 第 5 步：部署到 Cloudflare Workers

#### 方式 A：本地部署

```bash
pnpm deploy:cf:prod
```

#### 方式 B：通過 GitHub Actions 自動部署

1. **進入 GitHub 倉庫設置**
   - 訪問 https://github.com/luchuhua0908/teapot-sharing-hub/settings/secrets/actions

2. **添加 GitHub Secrets**
   - `CLOUDFLARE_API_TOKEN` - Cloudflare API 令牌
   - `CLOUDFLARE_ACCOUNT_ID` - Cloudflare 帳戶 ID
   - `DATABASE_URL` - 數據庫連接字符串
   - `JWT_SECRET` - JWT 密鑰
   - `VITE_APP_ID` - 應用 ID
   - `OAUTH_SERVER_URL` - OAuth 服務器 URL
   - `BUILT_IN_FORGE_API_URL` - Forge API URL
   - `BUILT_IN_FORGE_API_KEY` - Forge API 密鑰
   - `VITE_FRONTEND_FORGE_API_KEY` - 前端 Forge API 密鑰
   - `VITE_FRONTEND_FORGE_API_URL` - 前端 Forge API URL

3. **獲取 Cloudflare API 令牌**
   - 訪問 https://dash.cloudflare.com/profile/api-tokens
   - 點擊 **Create Token**
   - 選擇 **Edit Cloudflare Workers** 模板
   - 完成設置並複製令牌

4. **獲取 Cloudflare 帳戶 ID**
   - 訪問 https://dash.cloudflare.com/
   - 在右側邊欄找到 **Account ID**
   - 複製並保存

5. **推送代碼觸發自動部署**
   ```bash
   git push origin main
   ```

GitHub Actions 會自動構建和部署您的應用。

## 🌐 訪問已部署的應用

部署完成後，您的應用將在以下地址可用：

```
https://teapot-sharing-hub.workers.dev
```

## 🔍 驗證部署

### 檢查部署狀態

```bash
wrangler deployments list
```

### 查看實時日誌

```bash
wrangler tail --env production
```

### 測試 API 端點

```bash
curl https://teapot-sharing-hub.workers.dev/api/trpc/auth.me
```

## 🆘 故障排除

### 問題 1：部署失敗 - "Authentication failed"

**解決方案**：
```bash
wrangler logout
wrangler login
```

### 問題 2：構建失敗 - "pnpm not found"

**解決方案**：確保 pnpm 已安裝
```bash
npm install -g pnpm
```

### 問題 3：環境變量未設置

**解決方案**：檢查 secrets 是否正確設置
```bash
wrangler secret list --env production
```

### 問題 4：數據庫連接失敗

**解決方案**：
1. 確認 `DATABASE_URL` 正確
2. 確認數據庫可以從 Cloudflare Workers 訪問
3. 檢查防火牆規則

## 📚 有用的命令

```bash
# 查看部署歷史
wrangler deployments list

# 回滾到上一個版本
wrangler rollback

# 查看實時日誌
wrangler tail

# 本地開發
wrangler dev

# 部署到生產環境
pnpm deploy:cf:prod

# 查看當前配置
wrangler publish --dry-run
```

## 🔐 安全最佳實踐

1. **Never commit secrets** - 不要將密鑰提交到 Git
2. **Use GitHub Secrets** - 在 GitHub Actions 中使用 secrets
3. **Rotate API tokens** - 定期輪換 API 令牌
4. **Monitor deployments** - 監控部署日誌以查找異常

## 📞 支持

如果遇到問題，請：

1. 檢查 [Cloudflare Workers 文檔](https://developers.cloudflare.com/workers/)
2. 查看 [wrangler CLI 文檔](https://developers.cloudflare.com/workers/wrangler/)
3. 查看部署日誌以獲取詳細錯誤信息

---

**祝您部署順利！** 🚀
