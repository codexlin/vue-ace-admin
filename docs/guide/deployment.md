# 部署指南

> 本指南介绍如何部署 Vue Ace Admin 主应用。

## 📋 部署前准备

### 1. 环境变量配置

创建 `.env.production` 文件：

```bash
# API 基础路径
VITE_APP_BASE_API=/api

# API 完整地址
VITE_API_URL=https://your-api-domain.com

# 应用端口（开发环境）
VITE_APP_PORT=5173

# 构建压缩
VITE_BUILD_COMPRESS=gzip,brotli
```

### 2. 构建应用

```bash
# 构建生产版本
pnpm build:prod

# 构建产物在 dist/ 目录
```

## 🐳 Docker 部署

### Dockerfile

项目已包含 `Dockerfile`，使用多阶段构建：

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm build:prod

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 构建镜像

```bash
docker build -t vue-ace-admin:latest .
```

### 运行容器

```bash
docker run -d -p 80:80 vue-ace-admin:latest
```

### 环境变量处理

**构建时变量（Build-time）:**
- 在 Dockerfile 中使用 `ARG` 定义
- 在构建时传入：`docker build --build-arg VITE_API_URL=xxx`

**运行时变量（Runtime）:**
- 对于 Vue 应用，环境变量在构建时已打包
- 如需运行时配置，可使用配置文件或 API 获取

## ☁️ Vercel 部署

### 1. 连接 GitHub 仓库

1. 访问 [Vercel](https://vercel.com)
2. 导入 GitHub 仓库
3. 选择 `vue-ace-admin` 仓库

### 2. 配置项目

**Root Directory:** 留空（根目录）

**Build Command:**
```bash
corepack enable pnpm && pnpm install --no-frozen-lockfile && pnpm build:prod
```

**Output Directory:** `dist`

**Install Command:**
```bash
corepack enable pnpm && pnpm install --no-frozen-lockfile
```

### 3. 环境变量

在 Vercel 项目设置中添加环境变量：

- `VITE_APP_BASE_API`
- `VITE_API_URL`
- 其他需要的环境变量

### 4. 部署

点击 "Deploy" 按钮，Vercel 会自动部署。

## 🌐 其他部署方式

### Nginx 部署

1. **构建应用**
   ```bash
   pnpm build:prod
   ```

2. **配置 Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **部署文件**
   ```bash
   # 将 dist/ 目录内容复制到服务器
   scp -r dist/* user@server:/path/to/nginx/html/
   ```

### 静态文件托管

可以将 `dist/` 目录部署到任何静态文件托管服务：

- GitHub Pages
- Netlify
- Cloudflare Pages
- 阿里云 OSS
- 腾讯云 COS

## 🔒 安全考虑

### 1. 环境变量

- ✅ 不要在代码中硬编码敏感信息
- ✅ 使用环境变量管理配置
- ✅ 生产环境变量不要提交到 Git

### 2. API 安全

- ✅ 使用 HTTPS
- ✅ 配置 CORS
- ✅ 使用 Token 认证

### 3. 构建优化

- ✅ 移除 console 日志（生产环境）
- ✅ 启用代码压缩
- ✅ 使用 CDN 加速

## 📝 部署检查清单

- [ ] 环境变量已配置
- [ ] 构建成功无错误
- [ ] API 地址配置正确
- [ ] 路由配置正确（History 模式）
- [ ] 静态资源路径正确
- [ ] HTTPS 已启用
- [ ] 错误页面已配置（404、403）

## 🐛 常见问题

### 1. 路由 404

**问题**: 刷新页面出现 404

**解决**: 配置服务器支持 History 模式路由：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 2. 静态资源 404

**问题**: 图片、CSS 等资源加载失败

**解决**: 检查 `vite.config.ts` 中的 `base` 配置

### 3. API 请求失败

**问题**: API 请求跨域或 404

**解决**: 
- 检查 `VITE_API_URL` 配置
- 配置服务器 CORS
- 使用代理（开发环境）

## 📚 相关文档

- [开发指南](/guide/development) - 了解开发流程
- [主应用快速上手](/guide/app/quick-start) - 了解项目结构

