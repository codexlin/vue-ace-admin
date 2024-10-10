<script lang="tsx" setup>
import type { IData, IProps, TableSlotsType } from './type'
const { isZebra = 'none', useCardWrapper = true, tableProps } = defineProps<IProps>()
defineOptions({
  inheritAttrs: false
})
defineSlots<TableSlotsType>()
const attrs = useAttrs()
const propsData = computed(() => ({ ...attrs, ...tableProps }))
const slots = useSlots()
const slotNames = Object.keys(slots) as []
const initWrapper = () => (useCardWrapper ? 'a-card' : 'div')
const setRowClassName = (_record: any, index: number) => {
  const isEven = index % 2 === 0
  return (isZebra === 'even' && isEven) || (isZebra === 'odd' && !isEven) ? 'table-striped' : undefined
}
</script>
<template>
  <component :is="initWrapper()">
    <a-flex gap="small" vertical>
      <!-- 工具栏插槽 -->
      <div class="table-toolbar">
        <slot name="toolbar" />
      </div>
      <a-table class="ant-table-striped" v-bind="propsData" :row-class-name="setRowClassName">
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
  background-color: rgb(29 29 29);
}
</style>
