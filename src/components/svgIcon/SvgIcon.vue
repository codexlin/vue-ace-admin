<script lang="ts" setup>
import { Icon } from '@iconify/vue'

interface IProps {
  name: string
  prefix?: string
}
const { name, prefix = 'icon' } = defineProps<IProps>()
const symbolId = computed(() => `#${prefix}-${name}`)
</script>

<template>
  <Icon v-if="name.includes(':')" :icon="name" class="svg-icon" />
  <svg v-else aria-hidden="true" class="svg-icon">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<style lang="scss" scoped>
.svg-icon {
  width: 1.1em;
  height: 1.1em;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentcolor;
}
</style>
