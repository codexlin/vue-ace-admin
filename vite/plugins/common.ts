import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
export default function setupCommonPlugins() {
  return [
    vue(),
    vueJsx(),
    VueDevTools(), // 按需导入组件库
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
}
