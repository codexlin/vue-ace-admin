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

/**
 * 设置路由守卫
 * - 使用函数作用域的 flag 变量，确保每次应用初始化时状态独立
 * - 处理登录状态验证、动态路由加载、页面刷新等场景
 */
export function setupRouterHooks(): void {
  let flag = true // 函数作用域标识，记录路由是否已添加（每次调用独立）

  router.beforeEach(async (to, from, next) => {
    Nprogress.start()

    const routeStore = useRouteStore()
    const userStore = useUserStore()
    const routes = routeStore.getRoutes

    // 未登录处理
    if (!userStore.getToken) {
      // 白名单：登录页直接放行
      if (to.path === '/login') {
        Nprogress.done()
        return next()
      }
      // 其他页面跳转到登录页
      Nprogress.done()
      return next('/login')
    }

    // 已登录处理
    try {
      // 首次加载：路由已存储但未添加到路由实例
      if (flag && routes.length > 0) {
        await addRoutes(routes)
        console.log('动态路由已添加:', routes)
        flag = false
        return next({ path: to.path })
      }

      // 页面刷新：路由存储为空，需要重新加载
      if (routes.length === 0) {
        console.log('页面刷新，重新加载路由')
        await routeStore.setRoutes()
        return next({ path: to.path })
      }

      // 正常导航
      console.log('正常路由跳转:', to.path)
      return next()
    } catch (error) {
      console.error('路由守卫错误:', error)
      // 发生错误时跳转登录页
      Nprogress.done()
      return next('/login')
    }
  })

  // 路由跳转结束后的处理
  router.afterEach((to) => {
    // 设置页面标题
    setPageTitleTxt(to.meta)
    Nprogress.done()
  })
}

// vue3 + vite 中的动态引入组件的方法
const loadView = import.meta.glob('../views/**/*.vue')

/**
 * 异步添加动态路由
 * @param menu 路由配置数组
 * @description 递归遍历路由配置，将叶子节点（无子路由）添加到路由实例
 */
export async function addRoutes(menu: RouteRecordRaw[]): Promise<void> {
  for (const m of menu) {
    const { name, path, meta, children, component } = m

    // 只将叶子节点（页面）添加到路由中
    if (!children || children.length === 0) {
      // 仅当 component 为字符串路径时拼接视图 key，避免对象被隐式字符串化
      const viewKey = typeof component === 'string' ? `../views/${component as string}.vue` : null
      const viewImporter = viewKey ? loadView[viewKey] : undefined
      // 保证组件始终为可用的异步导入函数，避免 TS 选择需要 redirect 的重载
      const componentImporter = (viewImporter ?? loadView['../views/DefaultView.vue'])!

      router.addRoute('layout', {
        name,
        path,
        meta,
        // 动态加载组件，如果组件不存在则使用默认视图
        component: componentImporter as () => Promise<unknown>
      })
    } else {
      // 递归处理子路由
      await addRoutes(children)
    }
  }
}
