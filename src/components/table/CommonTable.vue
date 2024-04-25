<script lang="tsx" setup>
import type { IData, IProps } from './type'

const props = withDefaults(defineProps<IProps>(), {
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
const slots = useSlots()
const slotNames = Object.keys(slots) as []
</script>
<template>
  <a-flex gap="small" vertical>
    <!-- 工具栏插槽 -->
    <div class="table-toolbar">
      <slot name="toolbar" />
    </div>
    <a-table v-bind="props" class="ant-table-striped" :row-class-name="setRowClassName">
      <template v-for="(slot, index) of slotNames" :key="index" #[slot]="data:IData">
        <slot :name="slot" v-bind="data" />
      </template>
    </a-table>
  </a-flex>
</template>
<style scoped>
[data-theme='light'] .ant-table-striped :deep(.table-striped) td {
  background-color: #f6f6f6;
}

[data-theme='dark'] .ant-table-striped :deep(.table-striped) td {
  background-color: rgb(29, 29, 29);
}
</style>
