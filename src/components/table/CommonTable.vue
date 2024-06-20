<script lang="tsx" setup>
import type { IData, IProps } from './type'

const props = withDefaults(defineProps<IProps>(), {
  showHeader: true,
  isZebra: 'none',
  useCardWrapper: true
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
const initWrapper = () => {
  return props.useCardWrapper ? 'a-card' : 'div'
}
</script>
<template>
  <component :is="initWrapper()">
    <a-flex gap="small" vertical>
      <!-- 工具栏插槽 -->
      <div class="table-toolbar">
        <slot name="toolbar" />
      </div>
      <a-table :row-class-name="setRowClassName" class="ant-table-striped" v-bind="props">
        <template v-for="(slot, index) of slotNames" :key="index" #[slot]="data:IData">
          <slot :name="slot" v-bind="data" />
        </template>
      </a-table>
    </a-flex>
  </component>
</template>
<style scoped>
[data-theme='light'] .ant-table-striped :deep(.table-striped) td {
  background-color: #f6f6f6;
}

[data-theme='dark'] .ant-table-striped :deep(.table-striped) td {
  background-color: rgb(29, 29, 29);
}
</style>
