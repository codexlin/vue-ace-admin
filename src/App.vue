<script setup lang="ts">
import enUS from 'ant-design-vue/es/locale/en_US'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useAppStore } from '@/stores/modules/app'

dayjs.locale('zh-cn')
const app = useAppStore()
const antLang: Record<string, any> = {
  enUS,
  zhCN
}
const locale = computed(() => antLang[app.getLanguage as string])
const direction = computed(() => app.getDirection)
const theme = computed(() => app.themeConfig)
const spinning = ref(false)
const toggleSpinning = () => {
  spinning.value = !spinning.value
}
provide('appProvide', {
  spinning,
  toggleSpinning
})
</script>

<template>
  <a-config-provider :direction :theme :locale>
    <a-spin :spinning size="large">
      <RouterView />
    </a-spin>
  </a-config-provider>
</template>
