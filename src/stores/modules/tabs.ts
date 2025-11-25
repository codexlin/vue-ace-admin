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
type Key = string | number
export const useTabsStore = defineStore('tabs', () => {
  // 所有的标签页
  const tabList = ref<Props[]>([])
  // 当前标签页
  const activeKey = ref('/dashboard')
  const getTabList = computed<Props[]>(() => tabList.value)
  const router = useRouter()

  // 优化：使用 computed 自动管理缓存列表
  const getCacheTabs = computed<string[]>(() => {
    return router
      .getRoutes()
      .filter((route) => route.meta.isCache)
      .map((route) => route.name as string)
  })

  /**
   * 刷新标签页时临时移除缓存
   * @param name 组件名称
   * @param cb 刷新回调
   */
  async function refreshTab(name: string, cb: () => Promise<void>): Promise<void> {
    // 临时存储需要排除的组件
    const excludeCache = ref<string[]>([name])

    // 执行刷新回调
    await cb()

    // 清空排除列表，恢复缓存
    excludeCache.value = []
  }

  /**
   * @deprecated 使用 computed 的 getCacheTabs 自动管理，无需手动调用
   */
  function setCacheTabs(): void {
    // 保留此方法用于向后兼容，但已不需要手动调用
  }

  function clickTab(key: Key) {
    router.push(key as string)
  }

  function addTab(tab: Props) {
    tabList.value.push(tab)
  }

  const gotoLastPage = async () => {
    activeKey.value = tabList.value?.at(-1)?.key as string
    await router.push(activeKey.value)
  }

  async function deleteTab(type: TypeProps, key: string) {
    switch (type) {
      case 'all':
        tabList.value = tabList.value.filter((i) => i.key === '/dashboard')
        await gotoLastPage()
        break
      case 'other':
        tabList.value = tabList.value.filter((i) => i.key === '/dashboard' || i.key === key)
        break
      default:
        tabList.value = tabList.value.filter((i) => i.key !== key)
        break
    }
    if (activeKey.value === key) {
      await gotoLastPage()
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
