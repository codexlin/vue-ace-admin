<script lang="ts" setup>
import router from '@/router'
import { MailOutlined } from '@ant-design/icons-vue'
import type { ItemType } from 'ant-design-vue'
import { h, ref, VueElement, watch } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { useAppStore } from '@/stores/app'

const app = useAppStore()
const props = defineProps({
  menus: {
    type: Array as () => RouteRecordRaw[],
    required: true
  }
})
const rootSubmenuKeys = ref<string[]>([])
const openKeys = ref(['sub1'])
const selectedKeys = ref(['/dashboard'])
const items = ref<ItemType[]>([])
const onOpenChange = (keys: any[]) => {
  const latestOpenKey = keys.find((key) => openKeys.value.indexOf(key) === -1)
  if (rootSubmenuKeys.value.indexOf(latestOpenKey) === -1) {
    openKeys.value = keys
  } else {
    openKeys.value = latestOpenKey ? [latestOpenKey] : []
  }
}

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
function generateItems(data: RouteRecordRaw[]): ItemType[] {
  return data.map((item) => {
    const icon = item.meta?.icon || h(MailOutlined)
    let children
    if (item.children) {
      children = generateItems(item.children)
      rootSubmenuKeys.value.push(item.path)
    }
    return getItem(item.name as string, item.path, icon, children)
  })
}
const handleClick = (item: ItemType) => item?.key && router.push(item.key as string)

watch(
  () => props.menus,
  (menus) => {
    if (menus.length > 0) {
      items.value = generateItems(menus)
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    :items="items"
    :open-keys="openKeys"
    :theme="app.darkMode"
    class="custom-layout"
    mode="inline"
    @click="handleClick"
    @openChange="onOpenChange"
  >
    <!-- <template v-for="menu in menus">
      <a-menu-item v-if="!menu.children || menu.children.length === 0" :key="menu.path">
        <router-link :to="menu.path">
          <span>{{ menu.name }}</span>
        </router-link>
      </a-menu-item>
      <a-sub-menu v-else :key="menu.name">
        <template #title>
          <span>{{ menu.name }}</span>
        </template>
        <a-menu-item v-for="child in menu.children" :key="child.path">
          <router-link :to="child.path">
            <recursive-menu :menus="[child]" />
          </router-link>
        </a-menu-item>
      </a-sub-menu>
    </template> -->
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
