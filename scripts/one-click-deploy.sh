#!/bin/bash

# Vue Ace Admin 一键部署脚本
# 支持多种部署平台的快速部署

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${CYAN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# 显示横幅
show_banner() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    Vue Ace Admin 一键部署                    ║"
    echo "║                      快速部署到云平台                         ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# 检查依赖
check_dependencies() {
    log "检查依赖..."

    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js 未安装，请先安装 Node.js >= 18"
    fi

    # 检查 pnpm
    if ! command -v pnpm &> /dev/null; then
        warning "pnpm 未安装，正在安装..."
        npm install -g pnpm
    fi

    success "依赖检查通过"
}

# 选择部署平台
select_platform() {
    echo -e "${YELLOW}请选择部署平台:${NC}"
    echo "1) Vercel (推荐)"
    echo "2) Netlify"
    echo "3) GitHub Pages"
    echo "4) Docker 本地构建"
    echo "5) 自定义服务器"
    echo -n "请输入数字 (1-5): "

    read -r choice

    case $choice in
        1) PLATFORM="vercel" ;;
        2) PLATFORM="netlify" ;;
        3) PLATFORM="github" ;;
        4) PLATFORM="docker" ;;
        5) PLATFORM="custom" ;;
        *) error "无效选择，请输入 1-5" ;;
    esac

    log "选择的平台: $PLATFORM"
}

# 安装依赖
install_dependencies() {
    log "安装项目依赖..."

    if [ ! -d "node_modules" ]; then
        pnpm install
    else
        log "依赖已存在，跳过安装"
    fi

    success "依赖安装完成"
}

# 构建项目
build_project() {
    log "构建项目..."

    # 清理旧构建
    if [ -d "dist" ]; then
        rm -rf dist
        log "清理旧构建文件"
    fi

    # 构建主应用
    pnpm build:prod

    if [ ! -d "dist" ]; then
        error "构建失败，dist 目录不存在"
    fi

    success "项目构建完成"
}

# Vercel 部署
deploy_vercel() {
    log "部署到 Vercel..."

    # 检查 Vercel CLI
    if ! command -v vercel &> /dev/null; then
        warning "Vercel CLI 未安装，正在安装..."
        npm install -g vercel
    fi

    # 登录检查
    if ! vercel whoami &> /dev/null; then
        warning "未登录 Vercel，请登录..."
        vercel login
    fi

    # 部署
    vercel --prod --yes

    success "Vercel 部署完成！"
}

# Netlify 部署
deploy_netlify() {
    log "部署到 Netlify..."

    # 检查 Netlify CLI
    if ! command -v netlify &> /dev/null; then
        warning "Netlify CLI 未安装，正在安装..."
        npm install -g netlify-cli
    fi

    # 登录检查
    if ! netlify status &> /dev/null; then
        warning "未登录 Netlify，请登录..."
        netlify login
    fi

    # 部署
    netlify deploy --prod --dir=dist

    success "Netlify 部署完成！"
}

# GitHub Pages 部署
deploy_github() {
    log "部署到 GitHub Pages..."

    # 检查 git 状态
    if [ -n "$(git status --porcelain)" ]; then
        warning "工作区有未提交的更改，正在提交..."
        git add .
        git commit -m "Deploy: $(date +'%Y-%m-%d %H:%M:%S')"
    fi

    # 创建 gh-pages 分支
    git checkout -b gh-pages-temp

    # 添加构建文件
    git add dist -f
    git commit -m "Deploy to GitHub Pages: $(date +'%Y-%m-%d %H:%M:%S')"

    # 推送到 gh-pages 分支
    git subtree push --prefix dist origin gh-pages || {
        git push origin `git subtree split --prefix dist gh-pages-temp`:gh-pages --force
    }

    # 回到主分支
    git checkout main 2>/dev/null || git checkout master
    git branch -D gh-pages-temp

    success "GitHub Pages 部署完成！"
}

# Docker 构建
deploy_docker() {
    log "构建 Docker 镜像..."

    # 检查 Docker
    if ! command -v docker &> /dev/null; then
        error "Docker 未安装，请先安装 Docker"
    fi

    # 创建 Dockerfile (如果不存在)
    if [ ! -f "Dockerfile" ]; then
        log "创建 Dockerfile..."
        cat > Dockerfile << 'EOF'
# 多阶段构建
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package 文件
COPY package*.json pnpm-*.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build:prod

# 生产阶段
FROM nginx:alpine

# 复制构建文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
EOF
    fi

    # 创建 nginx 配置
    if [ ! -f "nginx.conf" ]; then
        log "创建 nginx.conf..."
        cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Vue Router 历史模式支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    fi

    # 构建镜像
    IMAGE_NAME="vue-ace-admin"
    IMAGE_TAG="latest"

    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

    success "Docker 镜像构建完成！"
    echo -e "${CYAN}启动命令: docker run -p 3000:80 ${IMAGE_NAME}:${IMAGE_TAG}${NC}"
}

# 自定义服务器部署
deploy_custom() {
    log "准备自定义服务器部署文件..."

    # 创建部署包
    DEPLOY_DIR="deploy-$(date +'%Y%m%d-%H%M%S')"
    mkdir -p "$DEPLOY_DIR"

    # 复制构建文件
    cp -r dist/* "$DEPLOY_DIR/"

    # 创建部署说明
    cat > "$DEPLOY_DIR/README.md" << 'EOF'
# 部署说明

## Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/deploy/directory;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Apache 配置示例

在网站根目录创建 `.htaccess` 文件：

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 上传文件

将此目录下的所有文件上传到你的服务器网站根目录。
EOF

    success "部署文件已准备完成: $DEPLOY_DIR/"
}

# 显示部署结果
show_result() {
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                        🎉 部署完成！                          ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"

    case $PLATFORM in
        "vercel")
            echo -e "${CYAN}🌐 你的应用已部署到 Vercel${NC}"
            echo -e "${CYAN}📱 访问链接将在 Vercel 面板中显示${NC}"
            ;;
        "netlify")
            echo -e "${CYAN}🌐 你的应用已部署到 Netlify${NC}"
            echo -e "${CYAN}📱 访问链接将在 Netlify 面板中显示${NC}"
            ;;
        "github")
            echo -e "${CYAN}🌐 你的应用已部署到 GitHub Pages${NC}"
            echo -e "${CYAN}📱 访问链接: https://username.github.io/repository-name${NC}"
            ;;
        "docker")
            echo -e "${CYAN}🐳 Docker 镜像构建完成${NC}"
            echo -e "${CYAN}🚀 启动命令: docker run -p 3000:80 vue-ace-admin:latest${NC}"
            ;;
        "custom")
            echo -e "${CYAN}📦 部署文件已准备完成${NC}"
            echo -e "${CYAN}📁 请查看 deploy-* 目录${NC}"
            ;;
    esac

    echo ""
    echo -e "${YELLOW}📚 组件库已发布到 npm:${NC}"
    echo -e "${CYAN}   npm install vue-ace-admin-ui${NC}"
    echo ""
    echo -e "${YELLOW}🔗 相关链接:${NC}"
    echo -e "${CYAN}   GitHub: https://github.com/codexlin/vue-ace-admin${NC}"
    echo -e "${CYAN}   npm: https://www.npmjs.com/package/vue-ace-admin-ui${NC}"
}

# 错误处理
trap 'error "部署过程中发生错误，请检查日志"' ERR

# 主函数
main() {
    show_banner

    # 检查是否在项目根目录
    if [ ! -f "package.json" ]; then
        error "请在项目根目录运行此脚本"
    fi

    check_dependencies
    select_platform
    install_dependencies
    build_project

    case $PLATFORM in
        "vercel") deploy_vercel ;;
        "netlify") deploy_netlify ;;
        "github") deploy_github ;;
        "docker") deploy_docker ;;
        "custom") deploy_custom ;;
    esac

    show_result
}

# 运行主函数
main "$@"
