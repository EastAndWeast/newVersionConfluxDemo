# Netlify 部署指南

本项目基于 **Vite + React** 构建，可以完美支持在 Netlify 上进行静态托管。

## 部署准备
我已经为您在 `app/` 目录下准备好了 `netlify.toml` 文件，它包含了构建指令和 SPA 路由重定向规则，确保页面刷新时不会出现 404。

## 部署方案 1：手动上传 (最快)
1. 在本地运行构建命令：
   ```bash
   cd app
   npm run build
   ```
2. 构建完成后，您会看到一个 `app/dist` 文件夹。
3. 登录 [Netlify](https://app.netlify.com/)，将 `dist` 文件夹直接拖拽到上传区域即可。

## 部署方案 2：关联 GitHub/GitLab (推荐)
1. 将代码上传到您的 Git 仓库。
2. 在 Netlify Dashboard 选择 **"Add new site"** -> **"Import an existing project"**。
3. 选择对应的仓库，Netlify 会自动识别并填充以下配置：
   - **Build Command**: `npm run build`
   - **Publish directory**: `app/dist` (由于项目在子目录下，请确保 **Base directory** 设置为 `app`)
4. 点击 **"Deploy site"**。

## 注意事项
- **API 代理**: 如果您在 `vite.config.js` 中配置了代理，请注意 Netlify 生产环境不支持 Vite Proxy。本项目的 `apiClient` 已经使用了绝对路径 `https://api.bitunion.io/v1`，因此**无需额外配置代理**，部署后可直接联调真实接口。
- **环境变量**: 如有 `.env` 文件，请记得在 Netlify 的 **"Site settings" > "Environment variables"** 中同步配置。

---
*文档生成于: 2026-01-29 (By Antigravity)*
