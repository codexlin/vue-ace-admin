<script setup lang="ts">
import LayoutView from './layout/index.vue'

import { useAppStore } from '@/stores/app'

const app = useAppStore()
// 需要调用一下以设置主题
;(() => app.darkModeComp)()
</script>

<template>
  <a-config-provider :theme="app.themeConfig">
    <LayoutView />
  </a-config-provider>
</template>