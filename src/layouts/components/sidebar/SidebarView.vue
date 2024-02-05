<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description:
-->
<script lang="ts" setup>
import { useAppStore } from '@/stores/modules/app'
import type { DrawerProps } from 'ant-design-vue'
import RecursiveMenuVue from './components/RecursiveMenu.vue'
import LogoView from '@/layouts/components/logo/index.vue'

const app = useAppStore()
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
      <LogoView />
      <RecursiveMenuVue />
    </a-layout-sider>
  </a-drawer>
  <a-layout-sider v-model:collapsed="app.collapsed" :trigger="null" class="custom-layout default-sidebar">
    <LogoView />
    <RecursiveMenuVue />
  </a-layout-sider>
</template>
