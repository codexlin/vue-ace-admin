/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description:
 */
import { router } from '@/router/index'
import { useMenuStoreWithOut } from '@/stores/modules/menu'
import { useUserStore } from '@/stores/modules/user'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import type { RouteRecordRaw } from 'vue-router'
export function setupRouterHooks() {
  let flag = true // 定义标识，记录路由是否添加
  router.beforeEach(async (to, from, next) => {
    Nprogress.start()
    const menuStore = useMenuStoreWithOut()
    const user = useUserStore()
    if (user.getToken) {
      if (flag && menuStore.getMenuList.length > 0) {
        addRoutes(menuStore.getMenuList)
        flag = false
        next({ path: to.path })
      }
      // 页面刷新时，重新加载路由
      if (menuStore.getMenuList.length === 0) {
        menuStore.setMenuList()
        next({ path: to.path })
      } else {
        next()
      }
    } else if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  })
  router.afterEach(() => {
    Nprogress.done()
  })
}

// vue3 + vite中的动态引入组件的方法
const loadView = import.meta.glob('../views/**/*.vue')

// 动态添加路由
export function addRoutes(menu: RouteRecordRaw[]) {
  console.log('addRoutes')
  menu.forEach((e) => {
    // 只将页面信息添加到路由中
    if (!e.children || e.children.length === 0) {
      router.addRoute('layout', {
        name: e.name,
        path: e.path,
        meta: { title: e.name },
        component: loadView[`../views${e.component}.vue`]
      })
    } else {
      addRoutes(e.children)
    }
  })
  console.log(router.getRoutes())
}
