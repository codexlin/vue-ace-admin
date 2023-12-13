import type { TableProps } from 'ant-design-vue'
export interface Props extends TableProps {
  isZebra: 'even' | 'odd' | 'none'
}
export interface Data {
  text: any
  record: any
  index: number
  column: any
}
