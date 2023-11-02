/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description:
 */
import { i18n } from '@/locales'
import { router } from '@/router/index'
import { useRouteStore } from '@/stores/modules/route'
import { useUserStore } from '@/stores/modules/user'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import type { RouteRecordRaw } from 'vue-router'

export const setPageTitleTxt = (meta: any) => {
  const { title } = meta
  if (title) window.document.title = i18n.global.t(title)
}

export function setupRouterHooks() {
  let flag = true // 定义标识，记录路由是否添加
  router.beforeEach(async (to, from, next) => {
    Nprogress.start()
    const routerStore = useRouteStore()
    const user = useUserStore()

    if (user.getToken) {
      if (flag && routerStore.getRoutes.length > 0) {
        addRoutes(routerStore.getRoutes)
        flag = false
        next({ path: to.path })
      }
      // 页面刷新时，重新加载路由
      if (routerStore.getRoutes.length === 0) {
        await routerStore.setRoutes()
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
  // 当路由跳转结束后
  router.afterEach((to) => {
    // 设置title
    setPageTitleTxt(to.meta)
    Nprogress.done()
  })
}

// vue3 + vite中的动态引入组件的方法
const loadView = import.meta.glob('../views/**/*.vue')

// 动态添加路由
export function addRoutes(menu: RouteRecordRaw[]) {
  console.log('addRoutes')
  menu.forEach((e) => {
    const { name, path, meta, children, component } = e
    // 只将页面信息添加到路由中
    if (!children || children.length === 0) {
      router.addRoute('layout', {
        name,
        path,
        meta,
        component: loadView[`../views${component}.vue`]
      })
    } else {
      addRoutes(children)
    }
  })
  console.log(router.getRoutes())
}
// 异步
// export function addRoutes(menu: RouteRecordRaw[]): Promise<void> {
//   return new Promise<void>((resolve) => {
//     console.log('addRoutes')
//     const promises: Promise<void>[] = []

//     menu.forEach((e) => {
//       const { name, path, meta, children, component } = e

//       if (!children || children.length === 0) {
//         const promise = new Promise<void>((resolve) => {
//           router.addRoute('layout', {
//             name,
//             path,
//             meta,
//             component: loadView[`../views${component}.vue`]
//           })
//           resolve()
//         })
//         promises.push(promise)
//       } else {
//         promises.push(addRoutes(children))
//       }
//     })

//     Promise.all(promises).then(() => {
//       console.log(router.getRoutes())
//       resolve()
//     })
//   })
// }
