<script lang="tsx" setup>
import type { Data, Props } from './type'

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  isZebra: undefined
})
const setRowClassName = (_record: any, index: number) => {
  switch (props.isZebra) {
    case 'even':
      return index % 2 === 0 ? 'table-striped' : undefined
    case 'odd':
      return index % 2 !== 0 ? 'table-striped' : undefined
    default:
      return undefined
  }
}
</script>
<template>
  <a-table v-bind="props" class="ant-table-striped" :row-class-name="setRowClassName">
    <template v-for="(_, name) in $slots" #[name]="data:Data">
      <slot :name="name" v-bind="data" />
    </template>
  </a-table>
</template>
<style scoped>
[data-theme='light'] .ant-table-striped :deep(.table-striped) td {
  background-color: #f6f6f6;
}
[data-theme='dark'] .ant-table-striped :deep(.table-striped) td {
  background-color: rgb(29, 29, 29);
}
</style>
