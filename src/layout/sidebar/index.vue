<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description: 
-->
<script lang="ts" setup>
import { layoutProviderKey, type LayoutProviderData } from '@/layout/type'
import { inject, ref } from 'vue'
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
const { menus } = inject(layoutProviderKey) as LayoutProviderData
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
    <RecursiveMenuVue :menus="menus" />
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
