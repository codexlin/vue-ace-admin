import ViteAutoImport from 'unplugin-auto-import/vite'

export default function setupAutoImport() {
  return ViteAutoImport({
    imports: ['vue', 'vue-router', 'pinia'],
    dts: 'types/auto-imports.d.ts',
    dirs: ['./src/hooks']
  })
}
