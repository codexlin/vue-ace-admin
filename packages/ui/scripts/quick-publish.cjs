#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')

function exec(command) {
  console.log(`> ${command}`)
  execSync(command, { stdio: 'inherit' })
}

function getRegistry() {
  return execSync('npm config get registry', { encoding: 'utf8' }).trim()
}

function main() {
  console.log('🚀 Quick Publish Script')

  // 读取版本号
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  console.log(`📦 ${pkg.name}@${pkg.version}`)

  // 显示当前镜像源
  const currentRegistry = getRegistry()
  console.log(`📡 当前镜像源: ${currentRegistry}`)

  try {
    // 1. 清理并构建
    console.log('\n🔨 Building...')
    exec('rm -rf dist')
    exec('pnpm build')

    // 2. 发布到 npm 官方源（临时使用官方源）
    console.log('\n🚀 Publishing to npm official registry...')
    exec('npm publish --registry https://registry.npmjs.org/')

    console.log('\n✅ Published successfully!')
    console.log(`📦 https://www.npmjs.com/package/${pkg.name}`)
  } catch (error) {
    console.error('\n❌ Publish failed:', error.message)
    process.exit(1)
  }
}

main()
