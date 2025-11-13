<script lang="tsx" setup>
import { computed, useAttrs, useSlots, shallowRef } from 'vue'
import type { IData, ProTableProps, TableSlotsType } from './type'

const props = withDefaults(defineProps<ProTableProps>(), {
  isZebra: 'none',
  useCardWrapper: true,
  showHeader: true
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
  // 如果 isZebra 为 'none'，不应用样式
  if (props.isZebra === 'none') {
    return ''
  }

  // index 从 0 开始：0, 1, 2, 3, 4...
  // 视觉上的行号：1, 2, 3, 4, 5...
  // 所以 index % 2 === 0 对应视觉上的奇数行（第 1, 3, 5... 行）
  // index % 2 === 1 对应视觉上的偶数行（第 2, 4, 6... 行）
  const isVisualOdd = index % 2 === 0 // 视觉上的奇数行（第 1, 3, 5... 行）
  const isVisualEven = index % 2 === 1 // 视觉上的偶数行（第 2, 4, 6... 行）

  const shouldApply =
    (props.isZebra === 'even' && isVisualEven) ||
    (props.isZebra === 'odd' && isVisualOdd)

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
