import { useIndexedDB } from '@/hooks/useIndexedDB'
import router from '@/router'
import { loginApi } from '@/views/user/login/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useMenuStoreWithOut } from './menu'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref(null)
  const getToken = computed(() => token.value)
  const { openDB, put, deleteData } = useIndexedDB()

  // 初始化
  async function init() {
    token.value = ''
    userInfo.value = null
    useMenuStoreWithOut().init()
    await openDB('my-database', 1, 'routes')
    await deleteData('routes', 'backendRoutes')
  }

  // 登录
  function login(form: any) {
    return loginApi(form).then(async (res) => {
      token.value = res.data.token
      userInfo.value = res.data
      // 转换后端路由信息并添加到路由实例
      await useMenuStoreWithOut().setMenuList()
      // 打开数据库并保存路由信息到 IndexedDB
      await openDB('my-database', 1, 'routes')
      await put('routes', 'backendRoutes', useMenuStoreWithOut().getMenuList)
      router.push('/dashboard')
    })
  }

  // 退出登录
  async function logout() {
    await init()
    console.log('logout', router.getRoutes())
    router.push({ name: 'login', replace: true })
  }

  return {
    token,
    userInfo,
    getToken,
    login,
    logout
  }
})
