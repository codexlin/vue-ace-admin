import { useIndexedDB } from '@/hooks/useIndexedDB'
import router from '@/router'
import { transformBackendRoutes } from '@/utils/common/handleRoutes'
import { loginApi } from '@/views/user/login/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref(null)
  const permissions = ref<string[]>([])
  const backendRoutes = ref<RouteRecordRaw[]>([])
  const getToken = computed(() => token.value)
  const getRoutes = computed(() => backendRoutes.value)
  const { openDB, get, put } = useIndexedDB()

  // 初始化
  function init() {
    token.value = ''
    userInfo.value = null
    permissions.value = []
    //  useTabbarStore().init()
    //  usePermissionStore().init()
    //  useKeepAliveStore().init()
  }

  // 登录
  function login(form: any) {
    return loginApi(form).then(async (res) => {
      token.value = res.data.token
      userInfo.value = res.data
      backendRoutes.value = res.data.menus
      // 转换函数，将后端路由信息转换为 Vue Router 可以理解的格式
      // 转换后端路由信息并添加到路由实例
      const routes = transformBackendRoutes(backendRoutes.value)
      routes.forEach((route: any) => {
        router.addRoute(route)
      })
      console.log('routes', routes)

      // 打开数据库并保存路由信息到 IndexedDB
      await openDB('my-database', 1, 'routes')
      await put('routes', 'backendRoutes', backendRoutes.value)

      router.push('/')
    })
  }

  // 退出登录
  function logout() {
    return logoutApi().then(() => {
      init()
    })
  }

  // 获取权限
  function getPermissions() {
    return permissionApi().then((res) => {
      permissions.value = res.result.permissions
      return permissions.value
    })
  }

  // 后端路由
  function getBackendRoutes() {
    return backendRoutesApi().then((res) => {
      permissions.value = res.result.permissions
      return res.result.backendRoutes
    })
  }

  return {
    token,
    userInfo,
    getRoutes,
    getToken,
    permissions,
    login,
    logout,
    getPermissions,
    getBackendRoutes,
    backendRoutes
  }
})
