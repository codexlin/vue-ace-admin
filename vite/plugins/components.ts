import IconsResolver from 'unplugin-icons/resolver'
import components from 'unplugin-vue-components/vite'

export default function setupComponents() {
  return components({
    resolvers: [IconsResolver()],
    dirs: ['src/components'],
    include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
    dts: 'types/components.d.ts'
  })
}
