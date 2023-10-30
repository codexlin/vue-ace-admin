/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description:
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface Props {
  title: string
  key: string
  closable?: boolean
  content?: string
}
export const useTabsStore = defineStore('tabs', () => {
  const tabList = ref<Props[]>([])
  const activeKey = ref('/dashboard')
  const getTabList = computed<Props[]>(() => tabList.value)
  function addTab(tab: Props) {
    tabList.value.push(tab)
  }
  function deleteTab(key: string) {
    tabList.value = tabList.value.filter((i) => i.key !== key)
    if (activeKey.value === key) {
      activeKey.value = tabList.value?.at(-1)?.key as string
    }
  }
  function init() {
    tabList.value = []
  }
  return { tabList, addTab, getTabList, deleteTab, init, activeKey }
})
