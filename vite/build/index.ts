import { BuildOptions } from 'vite'

/**
 * Vite 构建配置
 * @param env 环境变量
 * @param mode 构建模式
 */
export default function (env: Record<string, string>, mode: string): BuildOptions {
  const build: BuildOptions = {
    target: ['esnext'],
    outDir: mode === 'production' ? 'dist' : `dist-${mode}`,
    assetsDir: 'assets',
    sourcemap: env.VITE_BUILD_SOURCEMAP === 'true',
    chunkSizeWarningLimit: 1500,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 优化依赖预构建，避免循环依赖
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      // 配置打包文件分类输出
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        // 代码分割策略
        manualChunks: (id) => {
          // Vue 核心库（避免分割，可能导致循环依赖）
          if (id.includes('node_modules/vue/') ||
              id.includes('node_modules/@vue/') ||
              id.includes('node_modules/vue-router/') ||
              id.includes('node_modules/pinia/')) {
            return 'vue-vendor'
          }
          // Ant Design Vue 及其图标
          if (id.includes('node_modules/ant-design-vue/') ||
              id.includes('node_modules/@ant-design/')) {
            return 'antd-vendor'
          }
          // 图表库
          if (id.includes('node_modules/echarts/') ||
              id.includes('node_modules/vue-echarts/')) {
            return 'charts'
          }
          // 工具库
          if (id.includes('node_modules/dayjs/') ||
              id.includes('node_modules/axios/') ||
              id.includes('node_modules/radash/')) {
            return 'utils'
          }
          // 富文本编辑器（单独处理，避免和 Vue 冲突）
          if (id.includes('node_modules/tinymce/') ||
              id.includes('node_modules/@tinymce/')) {
            return 'vendor' // 暂时合并到 vendor，避免循环依赖
          }
          // 其他较大的第三方库
          if (id.includes('node_modules/')) {
            return 'vendor'
          }
        }
      }
    }
  }
  return build
}
