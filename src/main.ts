import { MotionPlugin } from '@vueuse/motion'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import 'normalize.css/normalize.css'
import '@ace-admin/ui/dist/ace-admin-ui.css'
import { createApp } from 'vue'
import App from './App.vue'
import directives from './directives'
import setupI18n from './locales'
import { setupRouter } from './router'
import pinia from './stores'
import './styles/main.scss'
const app = createApp(App)
directives(app)
app.use(pinia)
setupI18n(app)
app.use(Antd)
app.use(MotionPlugin)
setupRouter(app)
app.mount('#app')
