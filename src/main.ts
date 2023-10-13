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
import router from './router'
import './styles/main.scss'
const app = createApp(App)
const pinia = createPinia()
pinia.use(
  createPersistedState({
    // 全局 key 配置接受传入 Store key 的函数，并返回一个新的 storage 密钥。
    key: (id) => `__persist__${id}`,
    //  该配置将会使所有 Store 持久化存储，且必须配置 persist: false 显式禁用持久化。
    auto: true
  })
)
app.use(router)
app.use(Antd)
app.use(pinia)
app.mount('#app')
