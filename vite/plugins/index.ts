import type { PluginOption } from 'vite'
import setupAutoImport from './autoImport'
import setupCommonPlugins from './common'
import setupComponents from './components'
import setupIcons from './icon'
import setupSvgIcon from './svg-icon'

// 插件配置
export default function (viteEnv: Record<string, string>, isBuild: boolean) {
  const { VITE_BUILD_COMPRESS = '' } = viteEnv
  const plugins: PluginOption[] = [
    ...setupCommonPlugins(),
    setupAutoImport(),
    setupComponents(),
    setupIcons(),
    setupSvgIcon(isBuild)
  ]
  if (isBuild && VITE_BUILD_COMPRESS) {
    const compressList = VITE_BUILD_COMPRESS.split(',')
    // if (compressList.includes('gzip') || compressList.includes('brotli')) plugins.push(...setupCompression(viteEnv))
  }
  return plugins
}
