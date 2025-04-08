import Nprogress from 'nprogress'
import type { RouteRecordRaw } from 'vue-router'
import { i18n } from '@/locales'
import { router } from '@/router'
import { useAppStore } from '@/stores/modules/app'
import { useRouteStore } from '@/stores/modules/route'
import { useUserStore } from '@/stores/modules/user'
import 'nprogress/nprogress.css'

export const setPageTitleTxt = (meta: any) => {
  const appTitle = useAppStore().appConfig.appTitle
  const { title } = meta
  if (title) window.document.title = `${i18n.global.t(title)} | ${appTitle}`
}

// 设置路由守卫
export function setupRouterHooks() {
  let flag = true // 定义标识，记录路由是否添加
  router.beforeEach(async (to, from, next) => {
    Nprogress.start()
    const routerStore = useRouteStore()
    const user = useUserStore()
    const routes = routerStore.getRoutes
    if (user.getToken) {
      if (flag && routes.length > 0) {
        await addRoutes(routes)
        console.log(routes)
        flag = false
        return next({ path: to.path })
      }
      // 页面刷新时，重新加载路由
      if (routes.length === 0) {
        console.log('routes.length === 0')
        await routerStore.setRoutes()
        return next({ path: to.path })
      } else {
        console.log('routes.length === 0---else', to.path)
        return next()
      }
    } else if (to.path === '/login') {
      return next()
    } else {
      return next('/login')
    }
  })
  // 当路由跳转结束后
  router.afterEach((to) => {
    // 设置title
    setPageTitleTxt(to.meta)
    Nprogress.done()
  })
}

// vue3 + vite中的动态引入组件的方法
const loadView = import.meta.glob('../views/**/*.vue')

// 异步添加路由函数
export async function addRoutes(menu: RouteRecordRaw[]): Promise<void> {
  for (const m of menu) {
    const { name, path, meta, children, component } = m
    // 只将页面信息添加到路由中
    if (!children || children.length === 0) {
      router.addRoute('layout', {
        name,
        path,
        meta,
        component: loadView[`../views${component}.vue`] || loadView['../views/DefaultView.vue']
      })
    } else {
      await addRoutes(children)
    }
  }
}
