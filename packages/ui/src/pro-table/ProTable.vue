<script lang="tsx" setup>
import { useAttrs, computed, useSlots } from 'vue'
import type { IData, IProps, TableSlotsType } from './type'

const props = withDefaults(defineProps<IProps>(), {
  isZebra: 'none',
  useCardWrapper: true
})

defineOptions({
  inheritAttrs: false
})
defineSlots<TableSlotsType>()

const attrs = useAttrs()
const slots = useSlots()
const slotNames = Object.keys(slots) as string[]

const propsData = computed(() => ({ ...attrs }))
const initWrapper = (): 'a-card' | 'div' => (props.useCardWrapper ? 'a-card' : 'div')
const setRowClassName = (_record: unknown, index: number) => {
  const isEven = index % 2 === 0
  return (props.isZebra === 'even' && isEven) || (props.isZebra === 'odd' && !isEven) ? 'table-striped' : undefined
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
