<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import RecursiveMenuVue from './components/RecursiveMenu.vue'

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
const routes = useUserStore().getRoutes
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
    <RecursiveMenuVue :menus="routes[0].children" />
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
