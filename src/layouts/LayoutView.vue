<script lang="ts" setup>
import DefaultLayout from '@/layouts/default/DefaultLayout.vue'
import HorizonLayout from '@/layouts/horizon/HorizonLayout.vue'
import useConfig from '@/layouts/composables/useConfig'
import { useAppStore } from '@/stores/modules/app'

const { setHeaderConfig } = useConfig()
const app = useAppStore()

function handleLayoutChange(newVal: string) {
  const isDefault = newVal === 'default'
  setHeaderConfig({
    showBreadcrumb: isDefault,
    showLogo: true,
    mode: isDefault ? 'inline' : 'horizontal'
  })
}

watch(() => app.getLayout, handleLayoutChange, { immediate: true })
const layouts: { [key: string]: any } = {
  horizon: HorizonLayout,
  default: DefaultLayout
}
</script>
<template>
  <component :is="layouts[app.getLayout]" />
</template>
