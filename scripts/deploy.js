#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset)
}

function exec(command, options = {}) {
  try {
    log(`执行: ${command}`, 'cyan')
    return execSync(command, { stdio: 'inherit', ...options })
  } catch (error) {
    log(`命令执行失败: ${command}`, 'red')
    throw error
  }
}

// 获取命令行参数
const args = process.argv.slice(2)
const platform = args[0] || 'vercel'

async function deployMain() {
  log('🚀 部署主应用 (Vue Admin Dashboard)', 'blue')

  try {
    // 1. 检查是否在根目录
    if (!fs.existsSync('package.json')) {
      throw new Error('请在项目根目录运行此脚本')
    }

    // 2. 安装依赖
    log('📦 安装依赖...', 'yellow')
    exec('pnpm install')

    // 3. 构建主应用
    log('🔨 构建主应用...', 'yellow')
    exec('pnpm build:prod')

    // 4. 检查构建产物
    if (!fs.existsSync('dist')) {
      throw new Error('构建失败，dist 目录不存在')
    }
    log('✅ 主应用构建完成', 'green')

    // 5. 根据平台部署
    switch (platform) {
      case 'vercel':
        await deployToVercel()
        break
      case 'netlify':
        await deployToNetlify()
        break
      case 'github':
        await deployToGitHubPages()
        break
      case 'docker':
        await buildDockerImage()
        break
      default:
        log(`❌ 不支持的部署平台: ${platform}`, 'red')
        showUsage()
        process.exit(1)
    }
  } catch (error) {
    log(`❌ 部署失败: ${error.message}`, 'red')
    process.exit(1)
  }
}

async function deployToVercel() {
  log('🌐 部署到 Vercel...', 'blue')

  try {
    // 检查是否安装了 Vercel CLI
    exec('vercel --version', { stdio: 'pipe' })
  } catch {
    log('❌ 请先安装 Vercel CLI: npm i -g vercel', 'red')
    process.exit(1)
  }

  // 部署到 Vercel
  exec('vercel --prod')
  log('🎉 Vercel 部署完成!', 'green')
}

async function deployToNetlify() {
  log('🌐 部署到 Netlify...', 'blue')

  try {
    // 检查是否安装了 Netlify CLI
    exec('netlify --version', { stdio: 'pipe' })
  } catch {
    log('❌ 请先安装 Netlify CLI: npm i -g netlify-cli', 'red')
    process.exit(1)
  }

  // 部署到 Netlify
  exec('netlify deploy --prod --dir=dist')
  log('🎉 Netlify 部署完成!', 'green')
}

async function deployToGitHubPages() {
  log('🌐 部署文档到 GitHub Pages (gh-pages 分支)...', 'blue')

  try {
    // 1. 构建文档
    log('📚 构建 VitePress 文档...', 'yellow')
    exec('pnpm build:docs')

    // 2. 检查文档构建产物
    if (!fs.existsSync('docs/.vitepress/dist')) {
      throw new Error('文档构建失败，docs/.vitepress/dist 目录不存在')
    }

    // 3. 进入文档构建目录
    const docsDistPath = path.join(process.cwd(), 'docs/.vitepress/dist')

    // 4. 初始化 git 并推送到 gh-pages
    log('📤 推送到 gh-pages 分支...', 'yellow')
    process.chdir(docsDistPath)

    exec('git init')
    exec('git add -A')
    exec('git commit -m "docs: deploy documentation"')
    exec('git branch -M gh-pages')
    exec('git remote add origin https://github.com/codexlin/vue-ace-admin.git || true')
    exec('git push -f origin gh-pages')

    // 5. 返回项目根目录
    process.chdir(path.join(__dirname, '..'))

    log('🎉 文档已部署到 GitHub Pages!', 'green')
    log('📖 访问地址: https://codexlin.github.io/vue-ace-admin/', 'cyan')
  } catch (error) {
    log(`❌ GitHub Pages 部署失败: ${error.message}`, 'red')
    process.exit(1)
  }
}

async function buildDockerImage() {
  log('🐳 构建 Docker 镜像...', 'blue')

  // 检查是否有 Dockerfile
  if (!fs.existsSync('Dockerfile')) {
    log('📝 创建 Dockerfile...', 'yellow')
    createDockerfile()
  }

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const imageName = packageJson.name || 'vue-ace-admin'
  const imageTag = packageJson.version || 'latest'

  exec(`docker build -t ${imageName}:${imageTag} .`)
  exec(`docker tag ${imageName}:${imageTag} ${imageName}:latest`)

  log(`🎉 Docker 镜像构建完成: ${imageName}:${imageTag}`, 'green')
  log('🚀 启动容器: docker run -p 3000:80 ' + imageName, 'cyan')
}

function _createGitHubPagesScript() {
  const script = `#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')

function exec(command) {
  console.log('> ' + command)
  execSync(command, { stdio: 'inherit' })
}

function main() {
  console.log('🚀 Deploying to GitHub Pages...')

  // 创建临时分支
  exec('git checkout -b gh-pages-temp')

  // 添加构建文件到 git
  exec('git add dist -f')
  exec('git commit -m "Deploy to GitHub Pages"')

  // 推送 dist 目录到 gh-pages 分支
  exec('git subtree push --prefix dist origin gh-pages')

  // 返回原分支并删除临时分支
  exec('git checkout main || git checkout master')
  exec('git branch -D gh-pages-temp')

  console.log('✅ GitHub Pages deployment completed!')
}

main()
`

  fs.writeFileSync('scripts/gh-pages.js', script)
  exec('chmod +x scripts/gh-pages.js')
}

function createDockerfile() {
  const dockerfile = `# 多阶段构建
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package 文件
COPY package*.json pnpm-*.yaml ./
COPY packages/ui/package.json ./packages/ui/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build:prod

# 生产阶段
FROM nginx:alpine

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
`

  const nginxConf = `server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # API 代理 (如果需要)
    location /api/ {
        proxy_pass http://your-backend-server/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Vue Router 历史模式支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
`

  fs.writeFileSync('Dockerfile', dockerfile)
  fs.writeFileSync('nginx.conf', nginxConf)
  log('✅ Dockerfile 和 nginx.conf 已创建', 'green')
}

function showUsage() {
  console.log(`
🚀 Vue Ace Admin 部署脚本

用法:
  node scripts/deploy.js [platform]

支持的部署平台:
  vercel    - 部署到 Vercel (默认)
  netlify   - 部署到 Netlify
  github    - 部署到 GitHub Pages
  docker    - 构建 Docker 镜像

示例:
  node scripts/deploy.js vercel   # 部署到 Vercel
  node scripts/deploy.js docker   # 构建 Docker 镜像
  node scripts/deploy.js github   # 部署到 GitHub Pages

环境要求:
  - Node.js >= 18
  - pnpm
  - 对应平台的 CLI 工具 (vercel/netlify-cli/docker)
`)
}

// 处理命令行参数
if (args.includes('--help') || args.includes('-h')) {
  showUsage()
  process.exit(0)
}

// 开始部署
deployMain()
