import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { loginApi } from '@/views/user/login/api'

export const useUserStore = defineStore('app', () => {
  const token = ref('')
  const userInfo = ref(null)
  const permissions = ref<string[]>([])

  const getToken = computed(() => token.value)

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
    return loginApi(form).then((res) => {
      token.value = res.result.token
      userInfo.value = res.result
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

  return { token, userInfo, getToken, permissions, login, logout, getPermissions, getBackendRoutes }
})
