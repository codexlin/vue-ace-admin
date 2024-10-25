<script lang="ts" setup>
import DefaultLayout from '@/layouts/default/DefaultLayout.vue'
import HorizonLayout from '@/layouts/horizon/HorizonLayout.vue'
import useConfig from '@/layouts/composables/useConfig'
import { useAppStore } from '@/stores/modules/app'

const { setHeaderConfig } = useConfig()
const app = useAppStore()
const layout = ref()
function handleLayoutChange(newVal: string) {
  const isDefault = newVal === 'default'
  layout.value = isDefault ? DefaultLayout : HorizonLayout
  setHeaderConfig({
    showBreadcrumb: isDefault,
    showLogo: true,
    mode: isDefault ? 'inline' : 'horizontal'
  })
}
watchEffect(() => handleLayoutChange(app.getLayout))
</script>
<template>
  <component :is="layout" />
</template>
