import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteDemoPreviewPlugin } from '@vitepress-code-preview/plugin'

export default defineConfig({
  plugins: [viteDemoPreviewPlugin(), vueJsx()]
})
