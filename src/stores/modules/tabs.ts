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
  // 所有的标签页
  const tabList = ref<Props[]>([])
  // 当前标签页
  const activeKey = ref('/dashboard')
  const getTabList = computed<Props[]>(() => tabList.value)
  const router = useRouter()
  // 存放组件name用于缓存
  const cacheTabs = ref<Array<String>>([])
  const getCacheTabs = computed(() => cacheTabs.value)
  // 刷新tab时先清除后添加
  async function refreshTab(name, cb) {
    const index = cacheTabs.value.findIndex((i) => i === name)
    cacheTabs.value.splice(index, 1)
    await cb()
    cacheTabs.value.push(name)
  }
  // 初始化时设置需要缓存的Tabs
  function setCacheTabs() {
    cacheTabs.value = []
    router.getRoutes().forEach((i) => i.meta.isCache && cacheTabs.value.push(i.name as string))
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
  return {
    refreshTab,
    cacheTabs,
    tabList,
    addTab,
    getTabList,
    deleteTab,
    init,
    activeKey,
    clickTab,
    getCacheTabs,
    setCacheTabs
  }
})
