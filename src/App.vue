<script setup lang="ts">
import enUS from 'ant-design-vue/es/locale/en_US'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import { useAppStore } from '@/stores/modules/app'
import 'dayjs/locale/zh-cn'

const antLang: Record<string, any> = {
  enUS,
  zhCN
}
const app = useAppStore()
const locale = computed(() => antLang[app.getLanguage as string])
const direction = computed(() => app.getDirection)
const theme = computed(() => app.themeConfig)
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
  <a-config-provider :direction :theme :locale>
    <RouterView />
  </a-config-provider>
</template>
