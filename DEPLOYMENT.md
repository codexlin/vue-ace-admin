# 🚀 部署指南

本项目是一个 monorepo，包含主应用（Vue3 管理系统）和组件库。以下是各种部署方案。

## 📦 项目结构

```
vue-ace-admin/
├── src/                    # 主应用源码
├── packages/ui/            # 组件库
├── dist/                   # 构建输出
└── scripts/deploy.js       # 部署脚本
```

## 🎯 快速部署

### 1. Vercel 部署（推荐）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 一键部署
pnpm deploy:vercel
```

**或者直接推送到 GitHub，自动部署！**

### 2. Netlify 部署

```bash
# 1. 安装 Netlify CLI
npm i -g netlify-cli

# 2. 登录 Netlify
netlify login

# 3. 部署
pnpm deploy:netlify
```

### 3. GitHub Pages

```bash
# 推送到 GitHub 后自动部署到 Pages
pnpm deploy:github
```

### 4. Docker 部署

```bash
# 构建镜像
pnpm deploy:docker

# 运行容器
docker run -p 3000:80 ace-admin:latest
```

## 🔧 环境配置

### 环境变量

创建 `.env.production` 文件：

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_TITLE=Vue Ace Admin
VITE_APP_VERSION=1.0.0
```

### API 代理配置

在 `vercel.json` 中已配置 API 代理：

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "http://your-backend-server/$1"
    }
  ]
}
```

## 🌐 平台特定配置

### Vercel

- ✅ 零配置部署
- ✅ 自动 HTTPS
- ✅ CDN 加速
- ✅ 预览环境

### Netlify

- ✅ 表单处理
- ✅ 函数支持
- ✅ 分支预览

### GitHub Pages

- ✅ 免费托管
- ✅ 自定义域名
- ⚠️ 仅支持静态站点

### Docker

- ✅ 完全控制
- ✅ 可扩展
- ✅ 生产环境

## 📋 部署检查清单

- [ ] 环境变量已配置
- [ ] API 地址已更新
- [ ] 构建测试通过
- [ ] 域名配置正确
- [ ] HTTPS 证书有效

## 🔄 CI/CD 自动部署

项目已配置 GitHub Actions，推送代码自动触发部署：

- `main` 分支 → 生产环境
- 其他分支 → 预览环境

### 需要的 Secrets

在 GitHub 仓库设置中添加：

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
NPM_TOKEN=your-npm-token (用于发布组件库)
```

## 🎨 组件库发布

组件库已发布到 npm：

```bash
npm install vue-ace-admin-ui
```

发布新版本：

```bash
cd packages/ui
# 更新版本号
pnpm version patch
# 发布
pnpm publish:quick
```

## 🐛 常见问题

### 1. 构建失败

```bash
# 清理依赖重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 2. 路由 404

确保服务器配置了 SPA 历史模式支持：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 3. API 跨域

检查 `vercel.json` 中的代理配置和 CORS 头设置。

## 📞 支持

- 🐛 Bug 报告: [GitHub Issues]
- 💡 功能建议: [GitHub Discussions]
- 📧 联系方式: your.email@example.com

---

🎉 **部署完成后，你的应用将运行在云端！**
