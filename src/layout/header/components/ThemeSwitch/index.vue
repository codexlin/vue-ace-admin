<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-14 23:29:23
 * @Description: 
-->
<script lang="ts" setup>
import { useAppStore } from '@/stores/modules/app'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { ref, watch } from 'vue'

defineOptions({
  name: 'ThemeSwitch'
})
const app = useAppStore()
const check = ref(false)
watch(
  () => app.darkModeComp,
  (val) => {
    check.value = val === 'dark'
  }
)
const handleChange = () => {
  app.toggleDarkMode()
}
</script>

<template>
  <a-switch v-model:checked="check" @change="handleChange">
    <template #checkedChildren><check-outlined /></template>
    <template #unCheckedChildren><close-outlined /></template>
  </a-switch>
</template>

<style lang="scss" scoped></style>
@/stores/modules/app
