<script lang="tsx" setup>
import { computed, useAttrs, useSlots, shallowRef } from 'vue'
import type { IData, ProTableProps, TableSlotsType } from './type'

const props = withDefaults(defineProps<ProTableProps>(), {
  isZebra: 'none',
  useCardWrapper: true
})

defineOptions({
  inheritAttrs: false
})
defineSlots<TableSlotsType>()

const tableRef = shallowRef()
const attrs = useAttrs()
const slots = useSlots()
const slotNames = Object.keys(slots) as string[]

const tableProps = computed(() => {
  const { isZebra, useCardWrapper, rowClassName, ...rest } = props
  return {
    ...(attrs as Record<string, unknown>),
    ...rest
  }
})

const initWrapper = computed(() => (props.useCardWrapper ? 'a-card' : 'div'))

const getZebraClass = (index: number) => {
  const isEven = index % 2 === 0
  const shouldApply =
    (props.isZebra === 'even' && isEven) || (props.isZebra === 'odd' && !isEven)
  return shouldApply ? 'table-striped' : ''
}

const resolveRowClassName = (record: unknown, index: number, indent?: number) => {
  const zebra = getZebraClass(index)
  const userRowClassName = props.rowClassName

  const userClass =
    typeof userRowClassName === 'function'
      ? userRowClassName(record, index, indent)
      : userRowClassName

  return [userClass, zebra].filter(Boolean).join(' ') || undefined
}

defineExpose({
  tableRef,
  getTableInstance: () => tableRef.value
})
</script>

<template>
  <component :is="initWrapper">
    <a-flex gap="small" vertical>
      <!-- 工具栏插槽 -->
      <div class="table-toolbar">
        <slot name="toolbar" />
      </div>
      <a-table
        ref="tableRef"
        class="ant-table-striped"
        v-bind="tableProps"
        :row-class-name="resolveRowClassName"
      >
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
