import type { TableProps } from 'ant-design-vue'

export interface IProps extends TableProps {
  isZebra?: 'even' | 'odd' | 'none'
  useCardWrapper?: boolean
}

export interface IData {
  text: any
  record: any
  index: number
  column: any
}
