<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import enUS from 'ant-design-vue/es/locale/en_US'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
const app = useAppStore()
const locale = computed(() => (app.getLanguage === 'zh-cn' ? zhCN : enUS))
const direction = computed(() => app.getDirection)
void (() => {
  dayjs.locale('zh-cn')
  console.log(
    ` %c ace-admin  %c 基于vue3.4-vite5  构建 `,
    'color: #fadfa3; background: #030307; padding:5px 0;',
    'background: #fadfa3; padding:5px 0;'
  )
})()
</script>

<template>
  <a-config-provider :direction="direction" :theme="app.themeConfig" :locale="locale">
    <RouterView />
  </a-config-provider>
</template>
