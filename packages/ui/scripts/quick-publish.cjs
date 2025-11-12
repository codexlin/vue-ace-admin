#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 工具函数：执行命令
function exec(command, options = {}) {
  console.log(`> ${command}`)
  return execSync(command, { stdio: 'inherit', ...options })
}

// 工具函数：静默执行命令并返回结果
function execSilent(command) {
  return execSync(command, { encoding: 'utf8' }).trim()
}

// 获取当前 npm 镜像源
function getRegistry() {
  return execSilent('npm config get registry')
}

// 检查是否已登录 npm
function checkNpmLogin() {
  try {
    execSilent('npm whoami --registry https://registry.npmjs.org/')
    return true
  } catch {
    return false
  }
}

// 获取用户确认
function confirm(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question(`${question} (y/N): `, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
    })
  })
}

// 检查包是否已存在该版本
function checkVersionExists(packageName, version) {
  try {
    const result = execSilent(`npm view ${packageName}@${version} version 2>&1`)
    return result === version
  } catch {
    return false
  }
}

// 验证 dist 目录
function validateDistDirectory() {
  const distPath = path.resolve(process.cwd(), 'dist')

  if (!fs.existsSync(distPath)) {
    throw new Error('dist 目录不存在，构建可能失败')
  }

  // 检查关键文件（根据 vite.config.ts 中的配置）
  const criticalFiles = [
    { path: 'types/index.d.ts', desc: '类型声明文件' },
    { path: 'ace-admin-ui.es.js', desc: 'ES 模块' },
    { path: 'ace-admin-ui.umd.js', desc: 'UMD 模块' }
  ]

  const missingFiles = []
  criticalFiles.forEach((file) => {
    const fullPath = path.join(distPath, file.path)
    if (!fs.existsSync(fullPath)) {
      missingFiles.push(`${file.desc} (${file.path})`)
    }
  })

  if (missingFiles.length > 0) {
    throw new Error(`构建产物缺失:\n  - ${missingFiles.join('\n  - ')}`)
  }

  // 显示构建产物信息
  try {
    const distSize = execSilent('du -sh dist').split('\t')[0]
    console.log(`📊 构建产物大小: ${distSize}`)
  } catch {
    // 忽略获取大小失败的情况
  }
}

// 主函数
async function main() {
  console.log('🚀 Quick Publish Script\n')

  // 1. 读取 package.json
  const pkgPath = path.resolve(process.cwd(), 'package.json')
  if (!fs.existsSync(pkgPath)) {
    console.error('❌ 未找到 package.json 文件')
    process.exit(1)
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  console.log(`📦 包名: ${pkg.name}`)
  console.log(`📌 版本: ${pkg.version}\n`)

  // 2. 检查是否为私有包
  if (pkg.private) {
    console.error('❌ 这是一个私有包，无法发布到 npm')
    process.exit(1)
  }

  // 3. 显示当前镜像源
  const currentRegistry = getRegistry()
  console.log(`📡 当前镜像源: ${currentRegistry}`)
  console.log(`🎯 发布镜像源: https://registry.npmjs.org/\n`)

  // 4. 检查是否已登录
  if (!checkNpmLogin()) {
    console.error('❌ 未登录 npm 官方源，请先运行: npm login --registry https://registry.npmjs.org/')
    process.exit(1)
  }

  const npmUser = execSilent('npm whoami --registry https://registry.npmjs.org/')
  console.log(`👤 当前用户: ${npmUser}\n`)

  // 5. 检查版本是否已存在
  console.log('🔍 检查版本是否已存在...')
  if (checkVersionExists(pkg.name, pkg.version)) {
    console.error(`❌ 版本 ${pkg.version} 已存在，请先更新版本号`)
    console.log('\n💡 提示: 使用以下命令更新版本号:')
    console.log('   npm version patch  # 补丁版本 (1.0.0 -> 1.0.1)')
    console.log('   npm version minor  # 次版本 (1.0.0 -> 1.1.0)')
    console.log('   npm version major  # 主版本 (1.0.0 -> 2.0.0)')
    process.exit(1)
  }
  console.log('✅ 版本检查通过\n')

  // 6. 用户确认
  const shouldContinue = await confirm('是否继续发布?')
  if (!shouldContinue) {
    console.log('❌ 已取消发布')
    process.exit(0)
  }

  try {
    // 7. 清理旧构建产物
    console.log('\n🧹 清理旧构建产物...')
    if (fs.existsSync('dist')) {
      exec('rm -rf dist')
    }

    // 8. 构建
    console.log('\n🔨 构建中...')
    exec('pnpm build')

    // 9. 验证构建结果
    console.log('\n🔍 验证构建结果...')
    validateDistDirectory()
    console.log('✅ 构建验证通过')

    // 10. 发布到 npm
    console.log('\n🚀 发布到 npm 官方源...')
    exec('npm publish --registry https://registry.npmjs.org/')

    // 11. 成功提示
    console.log('\n✅ 发布成功!')
    console.log(`📦 查看包: https://www.npmjs.com/package/${pkg.name}`)
    console.log(`📖 版本详情: https://www.npmjs.com/package/${pkg.name}/v/${pkg.version}`)

    // 12. 恢复镜像源提示
    if (currentRegistry !== 'https://registry.npmjs.org/') {
      console.log(`\n💡 提示: 你的镜像源仍然是 ${currentRegistry}`)
    }
  } catch (error) {
    console.error('\n❌ 发布失败:', error.message)

    // 错误提示
    console.log('\n💡 常见错误解决方案:')
    console.log('1. 确认已登录: npm login --registry https://registry.npmjs.org/')
    console.log('2. 确认版本号未被使用')
    console.log('3. 确认包名未被占用')
    console.log('4. 确认网络连接正常')

    process.exit(1)
  }
}

// 捕获未处理的异常
process.on('uncaughtException', (error) => {
  console.error('\n❌ 未捕获的异常:', error.message)
  process.exit(1)
})

process.on('unhandledRejection', (error) => {
  console.error('\n❌ 未处理的 Promise 拒绝:', error.message)
  process.exit(1)
})

// 执行主函数
main()
