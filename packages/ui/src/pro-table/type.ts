import type { VNode } from 'vue'
import type { TableProps as AntTableProps } from 'ant-design-vue'

export type { AntTableProps }

/**
 * ProTable 组件属性定义（只包含扩展属性）
 */
export type ProTableProps<RecordType extends Record<string, any> = Record<string, any>> = AntTableProps<RecordType> & {
  /** 斑马纹模式 */
  isZebra?: 'even' | 'odd' | 'none'
  /** 是否使用卡片包装 */
  useCardWrapper?: boolean
}

/**
 * 表格数据类型
 */
export interface IData {
  text: any
  record: any
  index: number
  column: any
}

/**
 * 表格插槽类型
 */
export type TableSlotsType = {
  toolbar?(): VNode
  [key: string]: any
}

/**
 * 操作项类型定义
 */
export type Item = {
  /** 权限标识 */
  auth: string
  /** 显示文本 */
  text: string
  /** 回调函数 */
  cb: () => void
  /** 操作类型 */
  type: string
}

/**
 * 操作项集合
 */
export interface Items {
  items: Item[]
}
