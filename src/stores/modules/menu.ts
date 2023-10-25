/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description:
 */
import { addRoutes } from '@/router/routerHelp'
import { backendRoutesApi } from '@/views/user/login/api'
import type { RouteRecordRaw } from 'vue-router'

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useMenuStoreWithOut = defineStore('counter', () => {
  const menuList = ref<any[]>([])
  const getMenuList = computed(() => menuList.value)
  async function setMenuList() {
    console.log('setMenuList')
    const res = await backendRoutesApi()
    menuList.value = res.data as RouteRecordRaw[]
    addRoutes(menuList.value)
  }
  function init() {
    menuList.value = []
  }

  return { menuList, setMenuList, getMenuList, init }
})
