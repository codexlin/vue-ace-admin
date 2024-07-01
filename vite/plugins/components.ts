import IconsResolver from 'unplugin-icons/resolver'
import components from 'unplugin-vue-components/vite'

export default function setupComponents() {
  return components({
    // 自定义组件的解析器。
    resolvers: [IconsResolver()],
    // 组件的有效文件扩展名。
    extensions: ['vue', 'tsx', 'jsx'],
    // 相对路径，用于搜索组件的目录。
    dirs: ['src/components'],
    // 用于转换目标的过滤器。
    include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
    // 生成 `components.d.ts` 全局声明文件，
    dts: 'types/components.d.ts'
  })
}
