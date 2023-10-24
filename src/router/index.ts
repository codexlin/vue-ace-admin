/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-05-09 19:01:32
 * @Description:
 */
import { useIndexedDB } from '@/hooks/useIndexedDB'
import router from '@/router/routers/constant'
import { useUserStore } from '@/stores/user'
import { transformBackendRoutes } from '@/utils/common/handleRoutes'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteRoutes = ['/login', '/404']
/**
 * 路由拦截
 */
router.beforeEach(async (to, from, next) => {
  // 获取 store 和用户信息
  const user = useUserStore()
  const token = user.getToken
  const { openDB, get } = useIndexedDB()
  if (whiteRoutes.includes(to.path)) return next()
  // 如果用户已登录且还没有生成路由
  if (token && user.getRoutes.length === 0) {
    let backendRoutes

    // 打开数据库并尝试从 IndexedDB 获取后端路由信息
    await openDB('my-database', 1, 'routes')
    backendRoutes = await get('routes', 'backendRoutes')

    if (!backendRoutes) {
      // 如果 IndexedDB 中没有，则从后端获取
      backendRoutes = await fetch('/api/routes')
    }

    // 转换后端路由信息并添加到路由实例
    const routes = transformBackendRoutes(backendRoutes)
    routes.forEach((route) => {
      router.addRoute(route)
    })

    // 保存路由信息到 store
    user.backendRoutes = routes
    // 重新导航到当前路由
    next(to.path)
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
