<script lang="ts" setup>
import type { Props } from './type'

const props = withDefaults(defineProps<Props>(), {
  title: 'Feedback',
  value: 3,
  precision: 2,
  suffix: '%'
})
</script>
<template>
  <a-card>
    <a-statistic v-bind="props"> </a-statistic>
  </a-card>
</template>
