/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-09 21:03:39
 * @Description:
 */
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import 'normalize.css/normalize.css'
import { createApp } from 'vue'
import App from './App.vue'
import { useIndexedDB } from './hooks/useIndexedDB'
import setupI18n from './locales/index'
import router from './router'
import pinia from './stores/index'
import './styles/main.scss'
import { transformBackendRoutes } from './utils/common/handleRoutes'

const { openDB, get } = useIndexedDB()

async function initApp() {
  // 打开数据库并尝试从 IndexedDB 获取后端路由信息
  await openDB('my-database', 1, 'routes')
  const backendRoutes = await get('routes', 'backendRoutes')

  if (backendRoutes) {
    // 转换后端路由信息并添加到路由实例
    const routes = transformBackendRoutes(backendRoutes)
    routes.forEach((route) => {
      router.addRoute(route)
    })
  }
  const app = createApp(App)
  // 启动应用
  app.use(router).use(Antd).use(pinia)
  setupI18n(app)
  app.mount('#app')
}
initApp()
