import Nprogress from 'nprogress'
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import { i18n } from '@/locales'
import { router } from '@/router'
import { useAppStore } from '@/stores/modules/app'
import { useRouteStore } from '@/stores/modules/route'
import { useUserStore } from '@/stores/modules/user'
import 'nprogress/nprogress.css'

/**
 * 设置页面标题
 * @param meta 路由元信息
 */
export const setPageTitleTxt = (meta: RouteLocationNormalized['meta']): void => {
  const appTitle = useAppStore().appConfig.appTitle
  const { title } = meta
  if (title) {
    window.document.title = `${i18n.global.t(title as string)} | ${appTitle}`
  }
}

// 路由是否已添加的标识
let isRoutesAdded = false

/**
 * 设置路由守卫
 */
export function setupRouterHooks(): void {
  router.beforeEach(async (to, from, next) => {
    Nprogress.start()

    const userStore = useUserStore()
    const routeStore = useRouteStore()

    // 白名单路由直接放行
    if (to.path === '/login') {
      Nprogress.done()
      return next()
    }

    // 未登录跳转登录页
    if (!userStore.getToken) {
      Nprogress.done()
      return next('/login')
    }

    // 已登录且路由未添加，动态添加路由
    if (!isRoutesAdded) {
      try {
        // 如果路由存储为空，先加载路由配置
        if (routeStore.getRoutes.length === 0) {
          await routeStore.setRoutes()
        }

        // 添加动态路由
        await addRoutes(routeStore.getRoutes)
        isRoutesAdded = true

        // 使用 replace 避免历史记录堆积
        return next({ ...to, replace: true })
      } catch (error) {
        console.error('路由加载失败:', error)
        // 路由加载失败，跳转登录页
        await userStore.logout()
        return next('/login')
      }
    }

    next()
  })

  // 路由跳转结束后
  router.afterEach((to) => {
    setPageTitleTxt(to.meta)
    Nprogress.done()
  })
}

/**
 * 重置路由状态（用于登出时）
 */
export function resetRouterState(): void {
  isRoutesAdded = false
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
