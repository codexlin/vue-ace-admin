import { BuildOptions } from 'vite'

// 打包配置
export default function (env: Record<string, string>, mode: string) {
  const build: BuildOptions = {
    target: ['esnext'],
    outDir: mode === 'production' ? 'dist' : `dist-${mode}`,
    assetsDir: 'assets',
    sourcemap: env.VITE_BUILD_SOURCEMAP === 'true',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      // 配置打包文件分类输出
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  }
  return build
}
