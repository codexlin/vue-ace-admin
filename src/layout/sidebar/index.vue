<script lang="ts" setup>
import RecursiveMenuVue from '@/components/sidermenu/RecursiveMenu.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import useLocalI18n from '../../hooks/useLocalI18n'

const app = useAppStore()
defineOptions({
  name: 'SidebarView'
})
const isOpenSide = ref(false)
const onCollapse = (collapsed: boolean, type: string) => {
  console.log(collapsed, type)
}

const onBreakpoint = (broken: boolean) => {
  isOpenSide.value = broken
  console.log(broken)
}
const selectedKeys = ref<string[]>(['1'])
const { tt } = useLocalI18n()
const routes = useUserStore().getRoutes
console.log(routes[0].children)
</script>
<template>
  <a-layout-sider
    :class="isOpenSide && 'fixed-side'"
    breakpoint="lg"
    collapsed-width="0"
    @breakpoint="onBreakpoint"
    @collapse="onCollapse"
  >
    <div class="logo">logo</div>
    <RecursiveMenuVue :menus="routes[0].children" :theme="app.darkMode" class="custom-layout"> </RecursiveMenuVue>
  </a-layout-sider>
</template>
<style lang="scss" scoped>
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.fixed-side {
  position: absolute;
  z-index: 999;
}
</style>
