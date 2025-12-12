/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description: 路由状态管理
 */
import type { RouteRecordRaw } from 'vue-router'

import router from '@/router'
import { addRoutes } from '@/router/routerHelp'
import { backendRoutesApi } from '@/views/user/login/api'

export const useRouteStore = defineStore('route', () => {
  // 状态定义
  const routes = ref<RouteRecordRaw[]>([])

  // 计算属性
  const getRoutes = computed<RouteRecordRaw[]>(() => routes.value)

  /**
   * 从后端获取并设置动态路由
   * @description 调用后端接口获取菜单路由配置，并添加到路由实例
   * @throws 路由加载失败时抛出错误
   */
  async function setRoutes(routeData?: RouteRecordRaw[]): Promise<void> {
    try {
      let routeList: RouteRecordRaw[]

      if (routeData) {
        // 使用传入的路由数据
        routeList = routeData
      } else {
        // 从后端获取路由数据
        const res = await backendRoutesApi()
        if (Array.isArray(res.data)) {
          routeList = res.data as RouteRecordRaw[]
        } else {
          throw new Error('路由数据格式错误：期望数组类型')
        }
      }

      routes.value = routeList
      await addRoutes(routes.value)
      console.log('后端路由加载成功，共 %d 条', routes.value.length)
    } catch (error) {
      console.error('路由加载失败:', error)
      throw error
    }
  }

  /**
   * 重置路由状态
   * @description 清空已加载的动态路由并从 router 实例中移除（用于登出时）
   */
  function init(): void {
    // 从 router 实例中移除所有动态添加的路由
    routes.value.forEach((route) => {
      if (route.name && router.hasRoute(route.name)) {
        router.removeRoute(route.name)
      }
    })

    // 清空路由数组
    routes.value = []
  }

  return { routes, setRoutes, getRoutes, init }
})
