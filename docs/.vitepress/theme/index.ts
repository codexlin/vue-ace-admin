import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { ProButton, ProTable } from '@codexlin/ace-admin-ui'
import 'ant-design-vue/dist/reset.css'
import '@codexlin/ace-admin-ui/dist/ace-admin-ui.css'
import DemoPreview, { useComponents } from '@vitepress-code-preview/container'
import '@vitepress-code-preview/container/dist/style.css'
import Antd from 'ant-design-vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    ctx.app.use(Antd)
    useComponents(ctx.app, DemoPreview)
    // 注册全局组件
    ctx.app.component('ProButton', ProButton)
    ctx.app.component('ProTable', ProTable)
  }
} satisfies Theme
