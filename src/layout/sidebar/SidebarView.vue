<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description: 
-->
<script lang="ts" setup>
import { type LayoutProviderData, layoutProviderKey } from '@/layout/type'
import { inject, ref } from 'vue'
import RecursiveMenuVue from './components/RecursiveMenu.vue'

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
    <div class="logo">
      <img alt="logo" height="32" src="../../assets/logo.svg" width="32" />
      <span>Vue Ace Admin</span>
    </div>
    <RecursiveMenuVue :menus="menus" />
  </a-layout-sider>
</template>
<style lang="scss" scoped>
.logo {
  height: 32px;
  margin: 16px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  span {
    font-weight: bold;
  }
}

.fixed-side {
  position: absolute;
  z-index: 999;
}
</style>
