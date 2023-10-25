// import LayoutView from '@/layout/index.vue'
// import router from '@/router'
// import type { RouteRecordRaw } from 'vue-router'

// const pages = import.meta.glob('../../views/**/*.vue')
// console.log(pages)

// const resolveComponent = (name: any) => {
//   console.log('name', name)

//   const importPage = pages[`../../views/${name}.vue`]
//   console.log(
//     'importPage',
//     importPage().then((module: any) => module?.default)
//   )

//   if (!importPage) {
//     throw new Error(`Unknown page ${name}. Is it located under Pages with a .vue extension?`)
//   }
//   return importPage
// }

// export function transformBackendRoutes(backendRoutes: RouteRecordRaw[]): RouteRecordRaw[] {
//   return backendRoutes.map((route: any) => {
//     let component
//     if (route.component === 'Layout') {
//       component = LayoutView
//     } else {
//       component = route.component && resolveComponent(route.component)
//     }
//     return {
//       path: route.path,
//       name: route.name,
//       component,
//       children: route.children ? transformBackendRoutes(route.children) : [],
//       meta: route.meta
//     } as RouteRecordRaw
//   })
// }
// export async function generateRoutes(backendRoutes: RouteRecordRaw[]) {
//   // 转换后端路由信息并添加到路由实例
//   const routes = transformBackendRoutes(backendRoutes)
//   routes.forEach((route) => {
//     router.addRoute(route)
//   })
//   console.log('routes', routes)
//   return routes
// }
