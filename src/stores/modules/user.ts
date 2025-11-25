/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-30 20:49:23
 * @Description:
 */
import { useRouteStore } from './route'
import { useTabsStore } from './tabs'
import router from '@/router'
import { loginApi } from '@/views/user/login/api'
import { addRoutes, resetRouterState } from '@/router/routerHelp'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref<ILoginData>({ token: '', menus: [] })
  const getToken = computed(() => token.value)

  /**
   * 初始化用户状态
   */
  function init(): void {
    token.value = ''
    userInfo.value = { menus: [], token: '' }
    useRouteStore().init()
    useTabsStore().init()
  }

  /**
   * 用户登录
   * @param form 登录表单数据
   */
  async function login(form: ILoginForm): Promise<void> {
    const res = await loginApi<ILoginData, ILoginForm>(form)

    if (!res.data) {
      throw new Error('登录失败，未获取到用户数据')
    }

    token.value = res.data.token
    userInfo.value = res.data

    // 设置路由并添加到路由实例
    useRouteStore().routes = userInfo.value.menus
    await addRoutes(useRouteStore().routes)

    // 跳转到首页
    await router.push('/dashboard')
  }

  /**
   * 用户登出
   */
  async function logout(): Promise<void> {
    // 重置路由状态
    resetRouterState()
    // 跳转登录页
    await router.push({ name: 'login', replace: true })
    // 清空用户状态
    init()
  }

  return { token, userInfo, getToken, login, logout }
})
