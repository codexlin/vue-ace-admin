import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import type { PluginOption } from 'vite'
import setupAutoImport from './autoImport'
import setupComponents from './components'
import setupIcons from './icon'
import setupSvgIcon from './svg-icon'

export default function setupVitePlugins(viteEnv: Record<string, string>, isBuild: boolean) {
  const { VITE_USE_MOCK, VITE_BUILD_COMPRESS } = viteEnv
  const plugins: PluginOption[] = [
    vue(),
    vueJsx(),
    // 按需导入组件库
    Components({
      // 配置type文件生成位置
      dts: 'types/components.d.ts',
      resolvers: [
        AntDesignVueResolver({
          importStyle: false // css in js
        })
      ]
    })
  ]
  plugins.push(setupAutoImport())
  plugins.push(setupComponents())
  plugins.push(setupIcons())
  plugins.push(setupSvgIcon(isBuild))
  if (isBuild) {
    const compressList = VITE_BUILD_COMPRESS.split(',')
    // if (compressList.includes('gzip') || compressList.includes('brotli')) plugins.push(...setupCompression(viteEnv))
  }
  return plugins
}
