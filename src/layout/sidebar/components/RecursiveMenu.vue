<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-30 20:49:23
 * @Description: 
-->
<script lang="ts" setup>
import SvgIconVue from '@/components/svgicon/SvgIcon.vue'
import useLocalI18n from '@/hooks/useLocalI18n'
import router from '@/router'
import { useAppStore } from '@/stores/modules/app'
import { getLevelPaths } from '@/utils/common/routeUtil'
import { MailOutlined } from '@ant-design/icons-vue'
import type { ItemType } from 'ant-design-vue'
import { VueElement, h, ref, watch, type VNode } from 'vue'
import { type RouteRecordRaw } from 'vue-router'

const app = useAppStore()
const { tt } = useLocalI18n()

const props = defineProps({
  menus: {
    type: Array as () => RouteRecordRaw[],
    required: true
  }
})

// 根节点keys
const rootSubmenuKeys = ref<string[]>([])
const openKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([])
const items = ref<ItemType[]>([])

const handleClick = (item: ItemType) => item?.key && router.push(item.key as string)

const getItem = (
  label: VueElement | string,
  key: string,
  icon?: any,
  children?: ItemType[],
  type?: 'group'
): ItemType => ({
  key,
  icon,
  children,
  label,
  type
})
const generateItems = (data: RouteRecordRaw[]): ItemType[] => {
  return data.map((item) => {
    const icon = item.meta?.icon ? h(SvgIconVue as unknown as VNode, { name: item.meta?.icon }) : h(MailOutlined)
    let children
    if (item.children && item.children.length > 0) {
      children = generateItems(item.children)
      rootSubmenuKeys.value.push(item.path)
    }
    return getItem(tt(item.meta?.title as string), item.path, icon, children)
  })
}

watch(
  () => props.menus,
  (menus) => {
    items.value = menus.length > 0 ? generateItems(menus) : []
  },
  {
    immediate: true
  }
)
watch(
  () => router.currentRoute.value.path,
  (path) => {
    selectedKeys.value = [path]
    const paths = getLevelPaths(path)
    if (paths.length > 2) paths.pop()
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
    :theme="app.darkMode"
    class="custom-layout"
    mode="inline"
    @click="handleClick"
  >
  </a-menu>
</template>

<style lang="scss">
@import '@/styles/theme.scss';

.custom-layout {
  @include useTheme {
    background: getModeVar('bgColor') !important;
  }
}
</style>
