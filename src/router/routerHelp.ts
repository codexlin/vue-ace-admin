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
 * - isFirstNavigation 变量，函数作用域标识，标记是否为首次导航（每次应用初始化时重置为 true）
 * - 处理登录状态验证、动态路由加载、页面刷新等场景
 */
export function setupRouterHooks(): void {
  let isFirstNavigation = true // 标记是否为首次导航，用于判断是否需要添加动态路由

  router.beforeEach(async (to, from, next) => {
    Nprogress.start()

    const routeStore = useRouteStore()
    const userStore = useUserStore()
    const routes = routeStore.getRoutes

    // 白名单优先处理：登录页、404页等直接放行，不再执行后续逻辑
    const whiteList = ['/login', '/404', '/403']
    if (whiteList.includes(to.path)) {
      console.log(`📋 白名单页面，直接放行: ${to.path}`)
      Nprogress.done()
      return next()
    }

    // 未登录处理：跳转到登录页
    if (!userStore.getToken) {
      console.log(`🚫 未登录，跳转到登录页: ${to.path}`)
      Nprogress.done()
      return next('/login')
    }

    // 已登录处理：只有在非白名单页面才处理路由逻辑
    try {
      console.log(
        `🔍 路由守卫检查: isFirstNavigation=${isFirstNavigation}, routes.length=${routes.length}, path=${to.path}`
      )

      // 场景1：路由数据为空（页面刷新或直接访问URL）
      if (routes.length === 0) {
        console.log('📦 路由数据为空，重新加载...')
        await routeStore.setRoutes() // 获取路由数据
        await addRoutes(routeStore.getRoutes) // 添加到路由实例
        isFirstNavigation = false
        return next({ path: to.path })
      }

      // 场景2：路由数据存在但未添加到路由实例（首次登录或刷新后的首次导航）
      if (isFirstNavigation) {
        console.log('🚀 首次导航，添加动态路由...')
        await addRoutes(routes)
        isFirstNavigation = false
        return next({ path: to.path })
      }

      // 场景3：正常导航（路由已添加，isFirstNavigation=false）
      console.log('✅ 正常路由跳转:', to.path)
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
      // 检查路由是否已存在，避免重复添加
      const existingRoute = router.hasRoute(name as string)
      if (existingRoute) {
        console.log(`⚠️  路由已存在，跳过: ${name}`)
        continue
      }

      const cleanComponent = typeof component === 'string' ? component.replace(/^\//, '') : null
      const viewKey = cleanComponent ? `../views/${cleanComponent}.vue` : null
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
