/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-09 21:03:39
 * @Description: Vite配置
 */
import { defineConfig, loadEnv } from 'vite'
import viteConfig from './vite'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log(mode, env, command)
  const { loadPlugins, loadViteResolve, loadViteServer, loadViteBuild } = viteConfig
  const isBuildCommand = command === 'build'
  return {
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
