/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description:
 */
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import type { App } from 'vue'
import { setupRouterHooks } from './routerHelp'
import { basicRoutes } from '@/router/router'

const history = import.meta.env.VITE_HASH_ROUTE === 'true' ? createWebHashHistory : createWebHistory
export const router = createRouter({
  routes: basicRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
    // 始终滚动到顶部
    // return { top: 0 }
  },
  history: history()
})

export function setupRouter(app: App<Element>): void {
  // 路由钩子函数
  setupRouterHooks()
  app.use(router)
}

export default router
