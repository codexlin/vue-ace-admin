import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 确保正确处理 Vue SFC
        }
      }
    }),
    vueJsx(),
    dts({
      outDir: 'dist/types',
      insertTypesEntry: true,
      rollupTypes: true,
      staticImport: true,
      include: ['src/**/*'],
      exclude: ['src/**/__tests__/*', 'src/**/test.*', 'src/**/*.test.*'],
      compilerOptions: {
        skipLibCheck: true,
        declaration: true,
        emitDeclarationOnly: true,
        isolatedModules: false,
        noEmitOnError: false
      }
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AceAdminUi',
      fileName: (format) => `ace-admin-ui.${format}.js`,
      formats: ['es', 'umd'] // 指定构建格式
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'ant-design-vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          'ant-design-vue': 'AntDesignVue'
        },
        exports: 'named', // 解决命名和默认导出的警告
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'ace-admin-ui.css'
          }
          return assetInfo.name
        }
      }
    }
  }
})
