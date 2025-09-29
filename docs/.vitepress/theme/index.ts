import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { ProButton, ProTable } from '@ace-admin/ui'
import DemoPreview, { useComponents } from '@vitepress-code-preview/container'
import '@vitepress-code-preview/container/dist/style.css'

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    useComponents(ctx.app, DemoPreview)
    // 注册全局组件
    ctx.app.component('ProButton', ProButton)
    ctx.app.component('ProTable', ProTable)
  }
} satisfies Theme
