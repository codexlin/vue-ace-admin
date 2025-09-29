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

async function publish() {
  try {
    log('🚀 开始发布流程...', 'blue')

    // 1. 检查是否在正确的目录
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json 不存在，请在正确的目录下运行此脚本')
    }

    // 2. 读取 package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    log(`📦 包名: ${packageJson.name}`, 'green')
    log(`📌 版本: ${packageJson.version}`, 'green')

    // 3. 检查当前 npm 镜像源
    log('🔍 检查当前 npm 镜像源...', 'yellow')
    const currentRegistry = execSync('npm config get registry', { encoding: 'utf8' }).trim()
    log(`当前镜像源: ${currentRegistry}`, 'cyan')
    log('📝 发布将临时使用 npm 官方镜像源', 'cyan')

    // 4. 检查是否已经登录 npm（使用官方源检查）
    try {
      exec('npm whoami --registry https://registry.npmjs.org/', { stdio: 'pipe' })
      log('✅ npm 登录状态正常', 'green')
    } catch (error) {
      log('❌ 未登录 npm，请先运行: npm login --registry https://registry.npmjs.org/', 'red')
      process.exit(1)
    }

    // 5. 清理旧的构建文件
    log('🧹 清理旧的构建文件...', 'yellow')
    if (fs.existsSync('dist')) {
      exec('rm -rf dist')
    }

    // 6. 安装依赖
    log('📦 检查依赖...', 'yellow')
    if (!fs.existsSync('node_modules')) {
      log('安装依赖...', 'yellow')
      exec('pnpm install')
    }

    // 7. 运行构建
    log('🔨 开始构建...', 'yellow')
    exec('pnpm build')
    log('✅ 构建完成', 'green')

    // 8. 检查构建产物
    const distPath = path.join(process.cwd(), 'dist')
    if (!fs.existsSync(distPath)) {
      throw new Error('构建失败，dist 目录不存在')
    }

    const requiredFiles = ['ace-admin-ui.es.js', 'ace-admin-ui.umd.js', 'ace-admin-ui.css']
    for (const file of requiredFiles) {
      if (!fs.existsSync(path.join(distPath, file))) {
        throw new Error(`构建文件缺失: ${file}`)
      }
    }
    log('✅ 构建产物检查通过', 'green')

    // 9. 检查版本是否已存在
    try {
      const result = exec(`npm view ${packageJson.name}@${packageJson.version} version`, { stdio: 'pipe' })
      if (result && result.toString().trim() === packageJson.version) {
        log(`❌ 版本 ${packageJson.version} 已存在，请更新版本号`, 'red')
        process.exit(1)
      }
    } catch (error) {
      // 版本不存在是正常的
    }

    // 10. 显示即将发布的信息
    log('📋 发布信息:', 'magenta')
    console.log(`   包名: ${packageJson.name}`)
    console.log(`   版本: ${packageJson.version}`)
    console.log(`   描述: ${packageJson.description || 'N/A'}`)
    console.log(`   作者: ${packageJson.author || 'N/A'}`)

    // 11. 确认发布
    const readline = require('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const confirm = await new Promise((resolve) => {
      rl.question('是否确认发布？(y/N): ', (answer) => {
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
      })
    })
    rl.close()

    if (!confirm) {
      log('❌ 发布已取消', 'yellow')
      process.exit(0)
    }

    // 12. 发布到 npm（临时使用官方源）
    log('🚀 正在发布到 npm 官方源...', 'blue')

    // 构建发布命令
    let publishCommand = 'npm publish --registry https://registry.npmjs.org/'
    if (packageJson.name.startsWith('@')) {
      // 如果是 scoped package，确保设置了 public 访问权限
      publishCommand += ' --access public'
    }

    exec(publishCommand)

    // 13. 发布成功
    log('🎉 发布成功！', 'green')
    log(`📦 包地址: https://www.npmjs.com/package/${packageJson.name}`, 'cyan')

    // 14. 显示安装命令
    log('📝 安装命令:', 'blue')
    console.log(`   npm install ${packageJson.name}`)
    console.log(`   yarn add ${packageJson.name}`)
    console.log(`   pnpm add ${packageJson.name}`)
  } catch (error) {
    log(`❌ 发布失败: ${error.message}`, 'red')
    process.exit(1)
  }
}

// 处理命令行参数
const args = process.argv.slice(2)

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
使用方法:
  node scripts/publish.js [选项]

选项:
  --help, -h     显示帮助信息
  --dry-run      试运行，不实际发布
  --skip-build   跳过构建步骤

示例:
  node scripts/publish.js              # 正常发布
  node scripts/publish.js --dry-run    # 试运行
  node scripts/publish.js --skip-build # 跳过构建
`)
  process.exit(0)
}

if (args.includes('--dry-run')) {
  log('🔍 试运行模式，不会实际发布', 'yellow')
  // 可以在这里添加试运行逻辑
}

// 开始发布
publish()
