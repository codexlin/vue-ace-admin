import type { TableProps } from 'ant-design-vue'
// 选择ant-table常用的属性 避免继承全部Props导致bug
type SelectedTableProps = Pick<
  TableProps,
  | 'dropdownPrefixCls'
  | 'dataSource'
  | 'columns'
  | 'pagination'
  | 'loading'
  | 'size'
  | 'bordered'
  | 'locale'
  | 'onChange'
  | 'onResizeColumn'
  | 'rowSelection'
  | 'getPopupContainer'
  | 'scroll'
  | 'sortDirections'
  | 'showSorterTooltip'
>
export interface IProps extends SelectedTableProps {
  isZebra?: 'even' | 'odd' | 'none'
  useCardWrapper?: boolean
}

export interface IData {
  text: any
  record: any
  index: number
  column: any
}
