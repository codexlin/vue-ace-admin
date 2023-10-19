<script lang="tsx" setup>
import type Props from './type'

const props = withDefaults(defineProps<Props>(), {
  showHeader: true
})
interface Data {
  text: any
  record: any
  index: number
  column: any
}
</script>
<template>
  <a-table v-bind="props">
    <template v-for="(_, name) in $slots" #[name]="data:Data">
      <slot :name="name" v-bind="data"></slot>
    </template>
  </a-table>
</template>
