# 多阶段构建 - 构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 corepack 并启用 pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# 复制 package 文件（利用 Docker 缓存层）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/hooks/package.json ./packages/hooks/
COPY packages/ui/package.json ./packages/ui/

# 安装依赖
RUN pnpm install --no-frozen-lockfile

# 复制源代码
COPY . .

# 构建应用（先构建 hooks，再构建 ui，最后构建主应用）
RUN pnpm run build:hooks && pnpm run build:ui && pnpm run build:prod

# 生产阶段 - 使用 Nginx
FROM nginx:alpine

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
