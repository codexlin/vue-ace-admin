import { defineConfig, loadEnv } from 'vite'
import viteConfig from './vite'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  const { loadPlugins, loadViteResolve, loadViteServer, loadViteBuild, loadInitLog } = viteConfig
  loadInitLog()
  const isBuildCommand = command === 'build'
  return {
    // 移除所有console+debugger,使用默认的esbuild,比 terser 快 20-40倍,压缩率只差 1%-2%。
    esbuild: {
      drop: env.VITE_BUILD_DROP_CONSOLE === 'true' ? ['console', 'debugger'] : []
    },
    // 插件配置
    plugins: loadPlugins(env, isBuildCommand),
    // 解析配置
    resolve: loadViteResolve(),
    // 开发服务器配置
    server: loadViteServer(env),
    // 构建配置
    build: loadViteBuild(env, mode)
  }
})
