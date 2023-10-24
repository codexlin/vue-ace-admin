/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-09 21:03:39
 * @Description:
 */
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import 'normalize.css/normalize.css'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './App.vue'
import { useIndexedDB } from './hooks/useIndexedDB'
import setupI18n from './locales/index'
import router from './router'
import './styles/main.scss'
import { transformBackendRoutes } from './utils/common/handleRoutes'

const pinia = createPinia()
pinia.use(
  createPersistedState({
    // 全局 key 配置接受传入 Store key 的函数，并返回一个新的 storage 密钥。
    key: (id) => `__persist__${id}`,
    //  该配置将会使所有 Store 持久化存储，且必须配置 persist: false 显式禁用持久化。
    auto: true
  })
)
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
  app.use(router).use(Antd).use(pinia).mount('#app')
  setupI18n(app)

  // return app
}

const app = await initApp()
// console.log(store)

// app.use(router)
// app.use(Antd)
// app.use(pinia)
// app.mount('#app')
