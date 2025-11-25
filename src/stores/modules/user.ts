/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-30 20:49:23
 * @Description: 用户状态管理
 */
import { useRouteStore } from './route'
import { useTabsStore } from './tabs'
import router from '@/router'
import { loginApi } from '@/views/user/login/api'
import { addRoutes } from '@/router/routerHelp'

export const useUserStore = defineStore('user', () => {
  // 状态定义
  const token = ref<string>('')
  const userInfo = ref<ILoginData>({ token: '', menus: [] })

  // 计算属性
  const getToken = computed(() => token.value)

  /**
   * 初始化用户状态
   * @description 清空用户信息、token、路由和标签页
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
   * @throws 登录失败时抛出错误
   */
  async function login(form: ILoginForm): Promise<void> {
    try {
      const res = await loginApi<ILoginData, ILoginForm>(form)
      console.log('登录响应:', res)

      // 验证响应数据
      if (!res.data) {
        throw new Error('登录失败：未获取到用户数据')
      }

      // 保存用户信息
      token.value = res.data.token
      userInfo.value = res.data

      // 设置路由并添加到路由实例
      useRouteStore().routes = userInfo.value.menus
      await addRoutes(useRouteStore().routes)

      // 跳转到首页
      await router.push('/dashboard')
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  /**
   * 用户退出登录
   * @description 清空状态并跳转到登录页
   */
  async function logout(): Promise<void> {
    try {
      // 跳转到登录页
      await router.push({ name: 'login', replace: true })
      // 清空用户状态
      init()
    } catch (error) {
      console.error('退出登录失败:', error)
      // 即使跳转失败也要清空状态
      init()
    }
  }

  return { token, userInfo, getToken, login, logout }
})
