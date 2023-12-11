<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description: 
-->
<script lang="ts" setup>
import { useAppStore } from '@/stores/modules/app'
import type { DrawerProps } from 'ant-design-vue'
import RecursiveMenuVue from './components/RecursiveMenu.vue'

const app = useAppStore()
const width = computed(() => (app.collapsed ? '80px' : '200px'))
const placement = ref<DrawerProps['placement']>('left')
</script>
<template>
  <a-drawer
    :closable="false"
    :open="!app.collapsed"
    :placement="placement"
    class="custom-layout"
    width="200px"
    @close="app.toggleCollapsed"
  >
    <a-layout-sider v-model:collapsed="app.collapsed" :trigger="null" class="custom-layout">
      <div class="logo">
        <img alt="logo" height="32" src="../../assets/logo.svg" width="32" />
        <span v-if="!app.collapsed">Vue Ace Admin</span>
      </div>
      <RecursiveMenuVue />
    </a-layout-sider>
  </a-drawer>
  <a-layout-sider v-model:collapsed="app.collapsed" :trigger="null" class="custom-layout default-sidebar">
    <div class="logo">
      <img alt="logo" height="32" src="../../assets/logo.svg" width="32" />
      <span v-if="!app.collapsed">Vue Ace Admin</span>
    </div>
    <RecursiveMenuVue />
  </a-layout-sider>
</template>
<style lang="scss" scoped>
.logo {
  height: 32px;
  margin: 16px 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: v-bind(width);

  span {
    transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
    font-weight: bold;
  }
}
</style>
