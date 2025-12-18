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
            // Ant Design Vue 组件
            {
              name: 'antd-vendor',
              test: /\/node_modules\/ant-design-vue\//
            },
            // Ant Design 图标
            {
              name: 'icons',
              test: /\/node_modules\/@ant-design\//
            },
            // TinyMCE 核心编辑器 (按需加载)
            {
              name: 'tinymce-core',
              test: /\/node_modules\/tinymce\//
            },
            // TinyMCE Vue 包装器
            {
              name: 'tinymce-vue',
              test: /\/node_modules\/@tinymce\//
            },
            // TinyMCE 语言包 (单独拆分，可按需加载特定语言)
            {
              name: 'tinymce-i18n',
              test: /\/node_modules\/tinymce-i18n\//
            },
            // 图表库
            {
              name: 'charts',
              test: /\/node_modules\/(echarts|vue-echarts)\//
            },
            // 工具库
            {
              name: 'utils',
              test: /\/node_modules\/(dayjs|axios|radash|dompurify|marked|highlight\.js)\//
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
