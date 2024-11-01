<script lang="ts" setup>
import type { DrawerProps } from 'ant-design-vue'
import RecursiveMenuVue from './components/RecursiveMenu.vue'
import { useAppStore } from '@/stores/modules/app'
import LogoView from '@/layouts/components/logo/LogoView.vue'

const app = useAppStore()
const placement = ref<DrawerProps['placement']>('left')
</script>
<template>
  <a-drawer
    :closable="false"
    :open="!app.collapsed"
    :placement="placement"
    class="custom-drawer"
    width="200px"
    @close="app.toggleCollapsed"
  >
    <a-layout-sider v-model:collapsed="app.collapsed" :trigger="null" class="custom-drawer">
      <LogoView />
      <RecursiveMenuVue />
    </a-layout-sider>
  </a-drawer>
  <a-layout-sider v-model:collapsed="app.collapsed" :trigger="null" class="custom-drawer default-sidebar">
    <LogoView />
    <RecursiveMenuVue />
  </a-layout-sider>
</template>
