<script lang="ts" setup>
import SvgIcon from '../../../../../components/svgIcon/SvgIcon.vue'
import { useAppStore } from '@/stores/modules/app'

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
