<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-09 21:03:39
 * @Description: 
-->
<script setup lang="ts">
import LayoutVue from './layout/LayoutView.vue'

import { useAppStore } from '@/stores/app'
const app = useAppStore()
// 需要调用一下以设置主题
;(() => app.darkModeComp)()
</script>

<template>
  <a-config-provider :theme="app.themeConfig">
    <LayoutVue />
  </a-config-provider>
</template>
