<script lang="ts" setup>
import type { StatisticProps } from 'ant-design-vue'

const props = withDefaults(defineProps<StatisticProps>(), {
  title: 'Feedback',
  value: 3,
  suffix: ''
})
</script>
<template>
  <a-card>
    <a-statistic v-bind="props" />
  </a-card>
</template>
