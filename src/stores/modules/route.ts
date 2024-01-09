/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description:
 */
import { addRoutes } from '@/router/routerHelp'
import { backendRoutesApi } from '@/views/user/login/api'
import type { RouteRecordRaw } from 'vue-router'

export const useRouteStore = defineStore('route', () => {
  const routes = ref<any[]>([])
  const getRoutes = computed<RouteRecordRaw[]>(() => routes.value)
  async function setRoutes() {
    console.log('开始添加路由')
    const res = await backendRoutesApi()
    routes.value = res.data as RouteRecordRaw[]
    addRoutes(routes.value)
    console.log('路由添加完毕')
  }
  function init() {
    routes.value = []
  }

  return { routes, setRoutes, getRoutes, init }
})
