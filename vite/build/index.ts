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
        // Rolldown 代码分割策略 (使用 advancedChunks 替代 manualChunks)
        advancedChunks: {
          groups: [
            // Vue 核心库
            {
              name: 'vue-vendor',
              test: /\/node_modules\/(vue|@vue|vue-router|pinia)\//
            },
            // Ant Design Vue 及其图标
            {
              name: 'antd-vendor',
              test: /\/node_modules\/(ant-design-vue|@ant-design)\//
            },
            // 图表库
            {
              name: 'charts',
              test: /\/node_modules\/(echarts|vue-echarts)\//
            },
            // 工具库
            {
              name: 'utils',
              test: /\/node_modules\/(dayjs|axios|radash)\//
            },
            // 富文本编辑器
            {
              name: 'vendor',
              test: /\/node_modules\/(tinymce|@tinymce)\//
            },
            // 其他第三方库
            {
              name: 'vendor',
              test: /\/node_modules\//
            }
          ]
        }
      }
    }
  }
  return build
}
