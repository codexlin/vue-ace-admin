import { ServerOptions } from 'vite'

// 开发服务器配置
export default function (env: Record<string, string>) {
  const server: ServerOptions = {
    // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
    host: '0.0.0.0',
    // 服务器端口号
    port: env.VITE_APP_PORT as unknown as number,
    // 是否自动打开浏览器
    // open: true,
    proxy: {
      // '/api'
      [env.VITE_APP_BASE_API]: {
        target: env.VITE_API_URL, //  代理的请求服务器地址
        changeOrigin: true, // 跨域
        rewrite: (path: string) => path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
      }
    }
  }
  return server
}
