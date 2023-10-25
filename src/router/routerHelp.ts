import { router } from '@/router/index'
import { useMenuStoreWithOut } from '@/stores/modules/menu'

export function setupRouterHooks() {
  router.beforeEach((to, from, next) => {
    const menuStore = useMenuStoreWithOut()
    if (to.path === '/login') {
      console.log(111)
      next()
    } else {
      // 页面刷新时，重新加载路由
      if (menuStore.menuList.length === 0) {
        menuStore.setMenuList()
        next({ path: to.path })
        // next({ ...to, replace: true }) //此方法不生效
      } else {
        next()
      }
    }
  })
  router.afterEach(() => {})
}

// vue3 + vite中的动态引入组件的方法
const loadView = import.meta.glob('../views/**/*.vue')

// 动态添加路由
export function addRoutes(menu: any) {
  menu.forEach((e) => {
    // 只将页面信息添加到路由中
    if (!e.children || e.children.length === 0) {
      router.addRoute('layout', {
        name: e.path.slice(1),
        path: e.path,
        meta: { title: e.name },
        component: loadView[`../views${e.component}.vue`]
      })
    } else {
      addRoutes(e.children)
    }
  })
}
