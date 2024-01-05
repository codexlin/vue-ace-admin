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
import setupI18n from './locales'
import { setupRouter } from './router'
import pinia from './stores/index'
import './styles/main.scss'
import directives from './directives/index'
const app = createApp(App)
directives(app)
app.use(pinia)
setupI18n(app)
app.use(Antd)
setupRouter(app)
app.mount('#app')
