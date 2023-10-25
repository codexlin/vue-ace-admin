import { basicRoutes } from '@/router/router'
import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterHooks } from './routerHelp'

export const router = createRouter({
  history: createWebHistory(),
  routes: basicRoutes,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 }
  }
})

export function setupRouter(app: App<Element>): void {
  // 路由钩子函数
  setupRouterHooks()
  app.use(router)
}

export default router
