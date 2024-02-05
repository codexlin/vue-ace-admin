import { BuildOptions } from 'vite'

// 打包配置
export default function (env: Record<string, string>, mode: string) {
  const build: BuildOptions = {
    target: ['esnext'],
    outDir: mode === 'production' ? 'dist' : `dist-${mode}`,
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: env.VITE_BUILD_SOURCEMAP === 'true',
    terserOptions: {
      compress: {
        keep_infinity: true,
        drop_console: env.VITE_BUILD_DROP_CONSOLE === 'true',
        drop_debugger: env.VITE_BUILD_DROP_DEBUGGER === 'true'
      }
    },
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  }
  return build
}
