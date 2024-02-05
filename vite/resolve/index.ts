import { fileURLToPath, URL } from 'node:url'
import { AliasOptions, ResolveOptions } from 'vite'

type Resolve = ResolveOptions & {
  alias?: AliasOptions
}
// 配置模块解析规则
export default function (): Resolve {
  // 别名配置相对于当前文件路径
  const alias: AliasOptions = {
    '@': fileURLToPath(new URL('../../src', import.meta.url)),
    views: fileURLToPath(new URL('../../src/views', import.meta.url)),
    assets: fileURLToPath(new URL('../../src/assets', import.meta.url))
  }
  return { alias }
}
