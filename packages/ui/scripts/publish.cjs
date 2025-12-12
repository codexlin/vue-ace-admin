#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 工具函数
function exec(command, options = {}) {
  console.log(`> ${command}`)
  return execSync(command, { stdio: 'inherit', ...options })
}

function execSilent(command) {
  return execSync(command, { encoding: 'utf8' }).trim()
}

function getRegistry() {
  return execSilent('npm config get registry')
}

function checkNpmLogin() {
  try {
    execSilent('npm whoami --registry https://registry.npmjs.org/')
    return true
  } catch {
    return false
  }
}

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

function checkVersionExists(packageName, version) {
  try {
    const result = execSilent(`npm view ${packageName}@${version} version 2>&1`)
    return result === version
  } catch {
    return false
  }
}

function checkGitStatus() {
  try {
    const status = execSilent('git status --porcelain')
    return status === ''
  } catch {
    return true // 如果不是 git 仓库，跳过检查
  }
}

function getCurrentBranch() {
  try {
    return execSilent('git rev-parse --abbrev-ref HEAD')
  } catch {
    return null
  }
}

function validateDistDirectory() {
  const distPath = path.resolve(process.cwd(), 'dist')

  if (!fs.existsSync(distPath)) {
    throw new Error('dist 目录不存在')
  }

  // 检查关键文件（根据 vite.config.ts 中的配置）
  const criticalFiles = [
    { path: 'types/index.d.ts', desc: '类型声明文件', required: true },
    { path: 'ace-admin-ui.es.js', desc: 'ES 模块', required: true },
    { path: 'ace-admin-ui.umd.js', desc: 'UMD 模块', required: true },
    { path: 'ace-admin-ui.css', desc: '样式文件', required: false }
  ]

  const missingRequired = []
  const missingOptional = []

  criticalFiles.forEach((file) => {
    const fullPath = path.join(distPath, file.path)
    if (!fs.existsSync(fullPath)) {
      if (file.required) {
        missingRequired.push(`${file.desc} (${file.path})`)
      } else {
        missingOptional.push(`${file.desc} (${file.path})`)
      }
    }
  })

  if (missingRequired.length > 0) {
    throw new Error(`关键构建产物缺失:\n  - ${missingRequired.join('\n  - ')}`)
  }

  if (missingOptional.length > 0) {
    console.warn(`⚠️  可选文件缺失: ${missingOptional.map((f) => f.split('(')[1].replace(')', '')).join(', ')}`)
  }

  // 显示构建产物统计
  try {
    const distSize = execSilent('du -sh dist').split('\t')[0]
    console.log(`📊 构建产物大小: ${distSize}`)

    // 列出主要文件
    console.log('📦 主要文件:')
    criticalFiles.forEach((file) => {
      const fullPath = path.join(distPath, file.path)
      if (fs.existsSync(fullPath)) {
        const stat = fs.statSync(fullPath)
        const sizeKB = (stat.size / 1024).toFixed(2)
        console.log(`   ✓ ${file.desc}: ${sizeKB} KB`)
      }
    })
  } catch (error) {
    // 忽略统计失败的情况
    console.warn('⚠️  无法获取构建产物大小统计', error)
  }
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run')

  console.log('🚀 NPM Publish Script')
  console.log(isDryRun ? '🔍 模式: Dry Run (不会真正发布)\n' : '📤 模式: 正式发布\n')

  // 1. 读取 package.json
  const pkgPath = path.resolve(process.cwd(), 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

  console.log(`📦 包名: ${pkg.name}`)
  console.log(`📌 版本: ${pkg.version}`)
  console.log(`📝 描述: ${pkg.description || 'N/A'}\n`)

  // 2. 检查私有包
  if (pkg.private) {
    console.error('❌ 这是一个私有包 (private: true)')
    process.exit(1)
  }

  // 3. Git 检查
  console.log('📋 检查 Git 状态...')
  const currentBranch = getCurrentBranch()
  if (currentBranch) {
    console.log(`📍 当前分支: ${currentBranch}`)

    if (!isDryRun && currentBranch !== 'main' && currentBranch !== 'master') {
      const shouldContinue = await confirm(`⚠️  不在主分支，是否继续?`)
      if (!shouldContinue) {
        console.log('❌ 已取消')
        process.exit(0)
      }
    }

    if (!checkGitStatus()) {
      console.warn('⚠️  工作区有未提交的更改')
      if (!isDryRun) {
        const shouldContinue = await confirm('是否继续?')
        if (!shouldContinue) {
          console.log('❌ 已取消')
          process.exit(0)
        }
      }
    } else {
      console.log('✅ 工作区干净')
    }
  }

  // 4. 检查镜像源和登录状态
  const currentRegistry = getRegistry()
  console.log(`\n📡 当前镜像源: ${currentRegistry}`)
  console.log(`🎯 发布目标: https://registry.npmjs.org/`)

  if (!isDryRun) {
    if (!checkNpmLogin()) {
      console.error('\n❌ 未登录 npm，请先运行:')
      console.log('npm login --registry https://registry.npmjs.org/')
      process.exit(1)
    }

    const npmUser = execSilent('npm whoami --registry https://registry.npmjs.org/')
    console.log(`👤 当前用户: ${npmUser}`)
  }

  // 5. 检查版本
  console.log('\n🔍 检查版本...')
  if (!isDryRun && checkVersionExists(pkg.name, pkg.version)) {
    console.error(`❌ 版本 ${pkg.version} 已存在\n`)
    console.log('💡 使用以下命令更新版本:')
    console.log('   npm version patch  # 1.0.0 -> 1.0.1')
    console.log('   npm version minor  # 1.0.0 -> 1.1.0')
    console.log('   npm version major  # 1.0.0 -> 2.0.0')
    process.exit(1)
  }
  console.log('✅ 版本可用')

  // 6. 用户确认
  if (!isDryRun) {
    const shouldContinue = await confirm(`\n📤 确认发布 ${pkg.name}@${pkg.version}?`)
    if (!shouldContinue) {
      console.log('❌ 已取消')
      process.exit(0)
    }
  }

  try {
    // 7. 清理
    console.log('\n🧹 清理旧构建...')
    if (fs.existsSync('dist')) {
      exec('rm -rf dist')
    }

    // 8. 构建
    console.log('\n🔨 构建...')
    exec('pnpm build')

    // 9. 验证
    console.log('\n🔍 验证构建...')
    validateDistDirectory()
    console.log('✅ 构建验证通过')

    // 10. 发布
    if (isDryRun) {
      console.log('\n🔍 Dry Run: 执行模拟发布...')
      exec('npm publish --dry-run --registry https://registry.npmjs.org/')
      console.log('\n✅ Dry Run 完成 (未真正发布)')
    } else {
      console.log('\n🚀 发布到 npm...')
      exec('npm publish --registry https://registry.npmjs.org/')

      console.log('\n✅ 发布成功! 🎉')
      console.log(`\n📦 包地址: https://www.npmjs.com/package/${pkg.name}`)
      console.log(`📖 版本详情: https://www.npmjs.com/package/${pkg.name}/v/${pkg.version}`)

      // Git tag
      if (currentBranch) {
        const shouldTag = await confirm('\n🏷️  是否创建 Git tag?')
        if (shouldTag) {
          try {
            exec(`git tag v${pkg.version}`)
            console.log(`✅ 已创建 tag: v${pkg.version}`)

            const shouldPush = await confirm('是否推送 tag 到远程?')
            if (shouldPush) {
              exec(`git push origin v${pkg.version}`)
              console.log('✅ Tag 已推送')
            }
          } catch (error) {
            console.warn('⚠️  创建/推送 tag 失败:', error.message)
          }
        }
      }
    }
  } catch (error) {
    console.error('\n❌ 操作失败:', error.message)

    console.log('\n💡 故障排查:')
    console.log('1. npm login --registry https://registry.npmjs.org/')
    console.log('2. 检查版本号是否可用')
    console.log('3. 检查包名是否可用')
    console.log('4. 检查网络连接')
    console.log('5. 查看完整日志排查问题')

    process.exit(1)
  }
}

main().catch((error) => {
  console.error('\n❌ 未预期的错误:', error)
  process.exit(1)
})
