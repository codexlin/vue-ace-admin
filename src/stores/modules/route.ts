/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router'
import { addRoutes } from '@/router/routerHelp'
import { backendRoutesApi } from '@/views/user/login/api'

export const useRouteStore = defineStore('route', () => {
  const routes = ref<RouteRecordRaw[]>([])
  const getRoutes = computed<RouteRecordRaw[]>(() => routes.value)

  /**
   * 从后端获取并设置动态路由
   */
  async function setRoutes(): Promise<void> {
    try {
      const res = await backendRoutesApi()
      routes.value = res.data as RouteRecordRaw[]
      await addRoutes(routes.value)
    } catch (error) {
      console.error('路由加载失败:', error)
      throw error
    }
  }

  /**
   * 重置路由状态
   */
  function init(): void {
    routes.value = []
  }

  return { routes, setRoutes, getRoutes, init }
})
