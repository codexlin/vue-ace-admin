<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'

const app = useAppStore()

;(() =>
  console.log(
    ` %c ace-admin  %c 基于vue3.3-vite4  构建 `,
    'color: #fadfa3; background: #030307; padding:5px 0;',
    'background: #fadfa3; padding:5px 0;'
  ))()
</script>

<template>
  <a-config-provider :theme="app.themeConfig">
    <RouterView />
  </a-config-provider>
</template>
