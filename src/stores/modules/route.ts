/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description: 路由状态管理
 */
import type { RouteRecordRaw } from 'vue-router'
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
  async function setRoutes(): Promise<void> {
    try {
      const res = await backendRoutesApi()
      routes.value = res.data as RouteRecordRaw[]
      await addRoutes(routes.value)
      console.log('后端路由加载成功，共 %d 条', routes.value.length)
    } catch (error) {
      console.error('路由加载失败:', error)
      throw error
    }
  }

  /**
   * 重置路由状态
   * @description 清空已加载的动态路由（用于登出时）
   */
  function init(): void {
    routes.value = []
  }

  return { routes, setRoutes, getRoutes, init }
})
