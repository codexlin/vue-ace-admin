<script lang="ts" setup>
import type { ItemType } from 'ant-design-vue'
import type { VueElement } from 'vue'

import SvgIconVue from '@/components/svgIcon/SvgIcon.vue'
import useLocalI18n from '@/hooks/useLocalI18n'
import useConfig from '@/layouts/composables/useConfig'
import router from '@/router'
import { setPageTitleTxt } from '@/router/routerHelp'
import { useRouteStore } from '@/stores/modules/route'
import { getLevelPaths } from '@/utils/common/routeUtil'

const { headerConfig } = useConfig()
const { tt, watchSwitchLang } = useLocalI18n()
const menus = useRouteStore().getRoutes || []

const openKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([])
const items = ref<ItemType[]>([])
const handleClick = (item: ItemType) => item?.key && router.push(item.key as string)
const state = reactive({
  items,
  openKeys: headerConfig.value.mode === 'inline' ? openKeys : undefined,
  mode: headerConfig.value.mode,
  theme: undefined,
  onClick: handleClick
})

const getItem = (
  label: VueElement | string,
  key: string,
  icon?: any,
  children?: ItemType[],
  type?: 'group'
): ItemType =>
  ({
    key,
    icon,
    children,
    label,
    type
  }) as ItemType

const generateItems = (data: Routes): ItemType[] => {
  return data.map((item) => {
    const icon = item.meta?.icon && h(SvgIconVue as unknown as VNode, { name: item.meta?.icon })
    let children
    if (item.children && item.children.length > 0) children = generateItems(item.children)
    return getItem(tt(item.meta?.title as string), item.path, icon, children)
  })
}
const setItems = () => (items.value = generateItems(menus))
onMounted(() => setItems())
watchSwitchLang(setItems, () => setPageTitleTxt(router.currentRoute.value.meta))
watch(
  () => router.currentRoute.value.path,
  (path) => {
    openKeys.value = getLevelPaths(path)
    selectedKeys.value = [path]
  },
  {
    immediate: true
  }
)
</script>

<template>
  <a-menu v-model:selectedKeys="selectedKeys" style="border-inline-end: none" v-bind="state" />
</template>
