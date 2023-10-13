/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-09 21:03:39
 * @Description:
 */
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log(mode, env)
  return {
    plugins: [
      vue(),
      vueJsx(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false // css in js
          })
        ]
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/proxy': {
          target: env.VITE_APP_API_BASEURL,
          changeOrigin: command === 'serve' && env.VITE_OPEN_PROXY === 'true',
          rewrite: (path) => path.replace(/\/proxy/, '')
        }
      }
    },
    build: {
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
  }
})
