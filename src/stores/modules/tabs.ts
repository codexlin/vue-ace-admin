/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description:
 */

interface Props {
  title: string
  key: string
  closable?: boolean
  content?: string
}
type TypeProps = 'all' | 'other' | 'cur'
export const useTabsStore = defineStore('tabs', () => {
  const tabList = ref<Props[]>([])
  const activeKey = ref('/dashboard')
  const getTabList = computed<Props[]>(() => tabList.value)
  const router = useRouter()
  const cacheTabs = ref<Array<String>>([])
  function getCacheTabs() {
    cacheTabs.value = []
    router.getRoutes().forEach((i) => i.meta.isCache && cacheTabs.value.push(i.name as string))
    return cacheTabs.value
  }

  function clickTab(key: string) {
    router.push(key)
  }
  function addTab(tab: Props) {
    tabList.value.push(tab)
  }
  async function deleteTab(type: TypeProps, key: string) {
    switch (type) {
      case 'all':
        tabList.value = tabList.value.filter((i) => i.key === '/dashboard')
        break
      case 'other':
        tabList.value = tabList.value.filter((i) => i.key === '/dashboard' || i.key === key)
        break
      default:
        tabList.value = tabList.value.filter((i) => i.key !== key)
        break
    }
    if (activeKey.value === key) {
      activeKey.value = tabList.value?.at(-1)?.key as string
      await router.push(activeKey.value)
    }
  }
  function init() {
    tabList.value = []
  }
  return { cacheTabs, tabList, addTab, getTabList, deleteTab, init, activeKey, clickTab, getCacheTabs }
})
