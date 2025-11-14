# Docker 构建和环境变量最佳实践

## 📋 目录

1. [环境变量分类](#环境变量分类)
2. [Docker 构建最佳实践](#docker-构建最佳实践)
3. [环境变量处理策略](#环境变量处理策略)
4. [安全考虑](#安全考虑)
5. [针对本项目的实践](#针对本项目的实践)

---

## 🔍 环境变量分类

### 1. **构建时变量（Build-time Variables）**

在构建 Docker 镜像时需要的变量，会被打包到镜像中。

**特点：**
- 使用 `ARG` 在 Dockerfile 中定义
- 只在构建阶段可用
- 不会保留在最终镜像中（除非通过 `ENV` 传递）

**示例：**
- `VITE_BUILD_COMPRESS` - 压缩配置
- `VITE_BUILD_DROP_CONSOLE` - 是否移除 console
- `VITE_BUILD_SOURCEMAP` - 是否生成 sourcemap
- `NODE_ENV` - 构建环境

### 2. **运行时变量（Runtime Variables）**

在容器运行时需要的变量，通常包含敏感信息。

**特点：**
- 使用 `ENV` 在 Dockerfile 中定义默认值
- 或通过 `docker run -e` 传入
- 在容器运行时可用

**示例：**
- `VITE_APP_BASE_API` - API 基础路径
- `VITE_API_URL` - API 服务器地址
- 数据库连接信息
- API keys

---

## 🐳 Docker 构建最佳实践

### 1. **多阶段构建（Multi-stage Build）**

✅ **推荐做法：**

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
# ... 构建步骤

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

**优势：**
- 最终镜像体积小（只包含运行时需要的文件）
- 构建工具不会进入生产镜像
- 安全性更高

### 2. **利用 Docker 缓存层**

✅ **推荐做法：**

```dockerfile
# 先复制依赖文件
COPY package.json pnpm-workspace.yaml ./
COPY packages/*/package.json ./packages/*/

# 安装依赖（这一层会被缓存）
RUN pnpm install --no-frozen-lockfile

# 再复制源代码（源代码变化不会影响依赖安装层）
COPY . .
```

**优势：**
- 源代码变化时，只需重新安装依赖（如果依赖没变）
- 大幅提升构建速度

### 3. **使用 .dockerignore**

✅ **推荐做法：**

```dockerignore
# 忽略不需要的文件
node_modules
.git
.env
*.log
dist
```

**优势：**
- 减少构建上下文大小
- 加快构建速度
- 避免泄露敏感信息

### 4. **安全处理敏感信息**

✅ **推荐做法：**

```dockerfile
# ❌ 错误：硬编码敏感信息
ENV API_KEY=secret123

# ✅ 正确：通过 ARG 传入（构建时）
ARG API_KEY
ENV API_KEY=$API_KEY

# ✅ 更好：运行时传入（不打包到镜像）
# 在 docker-compose.yml 或 docker run 中传入
```

---

## 🔐 环境变量处理策略

### 策略 1：代码中提供默认值（当前方案）

**适用场景：**
- 构建时变量有合理的默认值
- 变量不是敏感信息
- 希望代码更健壮

**实现：**

```typescript
// vite/plugins/index.ts
export default function (viteEnv: Record<string, string>, isBuild: boolean) {
  const { VITE_BUILD_COMPRESS = '' } = viteEnv
  // ...
}
```

**优点：**
- ✅ 代码健壮，即使缺少环境变量也能工作
- ✅ 无需修改 Docker 配置
- ✅ 符合防御性编程

**缺点：**
- ❌ 默认值可能不适合所有环境

### 策略 2：Dockerfile 中使用 ARG 和 ENV

**适用场景：**
- 需要在构建时灵活配置
- 不同环境需要不同的构建配置

**实现：**

```dockerfile
# 定义构建参数
ARG VITE_BUILD_COMPRESS=""
ARG VITE_BUILD_DROP_CONSOLE="false"
ARG VITE_BUILD_SOURCEMAP="false"

# 设置为环境变量（构建时可用）
ENV VITE_BUILD_COMPRESS=$VITE_BUILD_COMPRESS
ENV VITE_BUILD_DROP_CONSOLE=$VITE_BUILD_DROP_CONSOLE
ENV VITE_BUILD_SOURCEMAP=$VITE_BUILD_SOURCEMAP

# 构建
RUN pnpm run build:prod
```

**使用：**

```bash
docker build \
  --build-arg VITE_BUILD_COMPRESS="gzip,brotli" \
  --build-arg VITE_BUILD_DROP_CONSOLE="true" \
  -t myapp .
```

**优点：**
- ✅ 灵活，可以在构建时配置
- ✅ 不将敏感信息打包到镜像

**缺点：**
- ❌ 需要修改 Dockerfile
- ❌ 配置更复杂

### 策略 3：复制 .env.production 文件

**适用场景：**
- 生产环境配置是公开的
- 配置相对固定

**实现：**

```dockerfile
# 只复制生产环境配置（不包含敏感信息）
COPY .env.production .env.production
```

**优点：**
- ✅ 简单直接

**缺点：**
- ❌ 可能泄露配置信息
- ❌ 不够灵活
- ❌ 需要确保 `.env.production` 不包含敏感信息

### 策略 4：混合方案（推荐）

**结合策略 1 和策略 2：**

```dockerfile
# Dockerfile
ARG VITE_BUILD_COMPRESS=""
ENV VITE_BUILD_COMPRESS=$VITE_BUILD_COMPRESS
```

```typescript
// vite/plugins/index.ts
export default function (viteEnv: Record<string, string>, isBuild: boolean) {
  // 提供默认值，但可以通过环境变量覆盖
  const { VITE_BUILD_COMPRESS = '' } = viteEnv
  // ...
}
```

**优点：**
- ✅ 代码健壮（有默认值）
- ✅ 灵活（可以通过 ARG 覆盖）
- ✅ 安全（不打包敏感信息）

---

## 🛡️ 安全考虑

### 1. **永远不要做的事情**

❌ **不要在 Dockerfile 中硬编码敏感信息：**

```dockerfile
# ❌ 错误
ENV DATABASE_PASSWORD=secret123
ENV API_KEY=abc123
```

❌ **不要将 .env 文件打包到镜像：**

```dockerfile
# ❌ 错误
COPY .env .env
```

❌ **不要在代码中硬编码敏感信息：**

```typescript
// ❌ 错误
const API_KEY = 'secret123'
```

### 2. **正确的做法**

✅ **使用 Docker Secrets 或环境变量：**

```yaml
# docker-compose.yml
services:
  app:
    build: .
    environment:
      - DATABASE_PASSWORD=${DATABASE_PASSWORD}
    secrets:
      - api_key
secrets:
  api_key:
    external: true
```

✅ **使用 .env.example 作为模板：**

```bash
# .env.example（提交到 Git）
VITE_APP_BASE_API=/api
VITE_API_URL=http://localhost:8080

# .env（不提交到 Git，本地使用）
VITE_APP_BASE_API=/api
VITE_API_URL=https://api.production.com
VITE_API_KEY=secret123  # 敏感信息
```

✅ **在 CI/CD 中使用 Secrets：**

```yaml
# GitHub Actions
- name: Build Docker image
  run: docker build --build-arg API_KEY=${{ secrets.API_KEY }} .
```

---

## 📦 针对本项目的实践

### 当前实现（推荐）

我们采用了**策略 1（代码中提供默认值）**，这是最适合当前项目的方案：

#### 1. **构建时变量处理**

```typescript
// vite/plugins/index.ts
const { VITE_BUILD_COMPRESS = '' } = viteEnv
if (isBuild && VITE_BUILD_COMPRESS) {
  // 只在有值时才处理
}
```

```typescript
// vite/server/index.ts
const { 
  VITE_APP_PORT = '3000', 
  VITE_APP_BASE_API = '/api', 
  VITE_API_URL = 'http://localhost:8080' 
} = env
```

#### 2. **.dockerignore 配置**

```dockerignore
# 环境变量（不打包到镜像）
.env
.env.*
!.env.example
```

#### 3. **Dockerfile 配置**

```dockerfile
# 不复制 .env 文件
# 不设置敏感的环境变量
# 使用 --no-frozen-lockfile 允许灵活安装依赖
```

### 如果需要更灵活的配置

如果将来需要在构建时配置，可以这样扩展：

```dockerfile
# Dockerfile
ARG VITE_BUILD_COMPRESS=""
ARG VITE_BUILD_DROP_CONSOLE="false"
ENV VITE_BUILD_COMPRESS=$VITE_BUILD_COMPRESS
ENV VITE_BUILD_DROP_CONSOLE=$VITE_BUILD_DROP_CONSOLE
```

```bash
# 构建时传入
docker build \
  --build-arg VITE_BUILD_COMPRESS="gzip" \
  --build-arg VITE_BUILD_DROP_CONSOLE="true" \
  -t vue-ace-admin .
```

### 运行时变量处理

对于运行时需要的变量（如 API 地址），应该在容器启动时传入：

```yaml
# docker-compose.yml
services:
  app:
    build: .
    environment:
      - VITE_APP_BASE_API=/api
      - VITE_API_URL=https://api.production.com
    # 或者使用 .env 文件
    env_file:
      - .env.production
```

```bash
# docker run
docker run -e VITE_API_URL=https://api.production.com myapp
```

---

## 📚 总结

### 最佳实践清单

✅ **构建时变量：**
- 在代码中提供合理的默认值
- 可以通过 Dockerfile ARG 覆盖
- 不包含敏感信息

✅ **运行时变量：**
- 通过环境变量或 secrets 传入
- 不在镜像中硬编码
- 使用 .env.example 作为模板

✅ **安全性：**
- 使用 .dockerignore 排除敏感文件
- 不在代码或 Dockerfile 中硬编码敏感信息
- 使用 CI/CD Secrets 管理敏感信息

✅ **灵活性：**
- 同一镜像可以在不同环境使用
- 通过环境变量配置不同环境
- 代码有合理的默认值

### 当前项目的实践

我们当前的做法符合最佳实践：

1. ✅ 代码中提供默认值（健壮性）
2. ✅ .dockerignore 排除 .env 文件（安全性）
3. ✅ 多阶段构建（效率）
4. ✅ 利用 Docker 缓存（性能）

如果需要更灵活的配置，可以按需添加 Dockerfile ARG 支持。
