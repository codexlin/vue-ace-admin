import LayoutView from '@/layout/index.vue'
import type { RouteRecordRaw } from 'vue-router'

const pages = import.meta.glob('../../views/**/*.vue')
console.log(pages)

const resolveComponent = (name: any) => {
  console.log('name', name)

  const importPage = pages[`../../views/${name}.vue`]
  console.log('importPage', importPage)

  if (!importPage) {
    throw new Error(`Unknown page ${name}. Is it located under Pages with a .vue extension?`)
  }

  return importPage().then((module: any) => module?.default)
  // return importPage.default
}

export function transformBackendRoutes(backendRoutes: RouteRecordRaw[]): RouteRecordRaw[] {
  return backendRoutes.map((route: any) => {
    let component
    if (route.component === 'Layout') {
      component = LayoutView
    } else {
      component = route.component && resolveComponent(route.component)
    }
    return {
      path: route.path,
      name: route.name,
      component,
      children: route.children ? transformBackendRoutes(route.children) : [],
      meta: route.meta
    } as RouteRecordRaw
  })
}
