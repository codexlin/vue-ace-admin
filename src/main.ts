import { MotionPlugin } from '@vueuse/motion'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import 'normalize.css/normalize.css'
import '@codexlin/ace-admin-ui/dist/ace-admin-ui.css'
import { createApp } from 'vue'
import App from './App.vue'
import directives from './directives'
import setupI18n from './locales'
import { setupRouter } from './router'
import pinia from './stores'
import './styles/main.scss'

const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('全局错误捕获:', err)
  console.error('错误组件:', instance)
  console.error('错误信息:', info)

  // 生产环境可以上报到监控平台
  if (import.meta.env.PROD) {
    // 示例: reportError({ error: err, component: instance, info })
  }
}

// 全局警告处理（仅开发环境）
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn(`警告: ${msg}`)
    console.warn('组件追踪:', trace)
  }
}

// 未捕获的 Promise 错误
window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的 Promise 错误:', event.reason)
  event.preventDefault()

  // 生产环境上报
  if (import.meta.env.PROD) {
    // reportError({ type: 'unhandledRejection', reason: event.reason })
  }
})

directives(app)
app.use(pinia)
setupI18n(app)
app.use(Antd)
app.use(MotionPlugin)
setupRouter(app)
app.mount('#app')
