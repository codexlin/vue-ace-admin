import { Table } from 'ant-design-vue'
import type { TableProps } from 'ant-design-vue'
import type { VNode } from 'vue'

type CustomSlotsType = {
  toolbar(): () => VNode
}
export type TableSlotsType = InstanceType<typeof Table>['$slots'] & CustomSlotsType
export interface IData {
  text: any
  record: any
  index: number
  column: any
}
export interface IProps {
  isZebra?: 'even' | 'odd' | 'none'
  useCardWrapper?: boolean
  tableProps: TableProps
}
