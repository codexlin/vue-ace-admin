/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description:
 */
import { addRoutes } from '@/router/routerHelp'
import { backendRoutesApi } from '@/views/user/login/api'

export const useRouteStore = defineStore('route', () => {
  const routes = ref<any[]>([])
  const getRoutes = computed<RouteRecordRaw[]>(() => routes.value)
  async function setRoutes() {
    console.log('setRoutes')
    const res = await backendRoutesApi()
    routes.value = res.data as RouteRecordRaw[]
    addRoutes(routes.value)
  }
  function init() {
    routes.value = []
  }

  return { routes, setRoutes, getRoutes, init }
})
