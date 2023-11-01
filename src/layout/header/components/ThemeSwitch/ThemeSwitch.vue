<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-14 23:29:23
 * @Description: 
-->
<script lang="ts" setup>
import { useAppStore } from '@/stores/modules/app'
import { ref, watch } from 'vue'
import SvgIcon from '@/components/svgicon/SvgIcon.vue'

const app = useAppStore()
const check = ref(false)
watch(
  () => app.darkModeComp,
  (val) => {
    check.value = val === 'dark'
  },
  {
    immediate: true
  }
)
const handleChange = () => {
  app.toggleDarkMode()
}
</script>

<template>
  <a-switch v-model:checked="check" @change="handleChange">
    <template #checkedChildren>
      <SvgIcon name="radix-icons:moon" />
    </template>
    <template #unCheckedChildren>
      <SvgIcon name="humbleicons:sun" />
    </template>
  </a-switch>
</template>

<style lang="scss" scoped></style>
