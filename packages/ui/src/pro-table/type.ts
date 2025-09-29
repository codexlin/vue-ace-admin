import type { VNode } from 'vue'

// ======================
// ProTable 扩展类型
// ======================

/**
 * ProTable 组件属性定义（只包含扩展属性）
 */
export interface IProps {
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

// ======================
// 类型别名
// ======================

/**
 * ProTable 属性类型别名
 */
export type ProTableProps = IProps

// ======================
// 工具函数
// ======================

/**
 * 检查是否为函数
 */
export function isFunction(value: any): value is Function {
  return typeof value === 'function'
}
