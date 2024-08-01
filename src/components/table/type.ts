import type { TableProps } from 'ant-design-vue'

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
