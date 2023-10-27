import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import type { PluginOption } from 'vite'
import setupComponents from './components'
import setupIcons from './icon'
import setupSvgIcon from './svg-icon'

export default function setupVitePlugins(viteEnv: Record<string, string>, isBuild: boolean) {
  const { VITE_USE_MOCK, VITE_BUILD_COMPRESS } = viteEnv
  const plugins: PluginOption[] = [
    vue(),
    vueJsx(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false // css in js
        })
      ]
    })
  ]
  plugins.push(setupComponents())
  plugins.push(setupIcons())
  plugins.push(setupSvgIcon(isBuild))
  if (isBuild) {
    const compressList = VITE_BUILD_COMPRESS.split(',')
    // if (compressList.includes('gzip') || compressList.includes('brotli')) plugins.push(...setupCompression(viteEnv))
  }
  return plugins
}
