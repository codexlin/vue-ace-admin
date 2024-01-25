<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-30 20:49:23
 * @Description: 
-->
<script lang="ts" setup>
import SvgIconVue from '@/components/svgicon/SvgIcon.vue'
import useLocalI18n from '@/hooks/useLocalI18n'
import router from '@/router'
import { setPageTitleTxt } from '@/router/routerHelp'
import { useRouteStore } from '@/stores/modules/route'
import { getLevelPaths } from '@/utils/common/routeUtil'
import type { ItemType } from 'ant-design-vue'
import type { Routes } from 'types/common'

const { tt, watchSwitchLang } = useLocalI18n()
const menus = useRouteStore().getRoutes || []

const openKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([])
const items = ref<ItemType[]>([])

const handleClick = (item: ItemType) => item?.key && router.push(item.key as string)

const getItem = (label: VNode | string, key: string, icon?: any, children?: ItemType[], type?: 'group'): ItemType => ({
  key,
  icon,
  children,
  label,
  type
})

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
    selectedKeys.value = [path]
    const paths = getLevelPaths(path)
    openKeys.value = paths
  },
  { immediate: true }
)
</script>

<template>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    :items="items"
    :openKeys="openKeys"
    :theme="undefined"
    mode="inline"
    @click="handleClick"
  >
  </a-menu>
</template>
