import type { VNode } from 'vue'

// ======================
// ProButton 扩展类型
// ======================

/**
 * ProButton 组件属性定义（只包含扩展属性）
 */
export interface Props {
  /** 是否自动显示 loading 状态 */
  autoLoading?: boolean
  /** 是否启用确认弹窗 */
  enableConfirm?: boolean
  /** 确认弹窗配置 */
  popConfig?: PopconfirmProps
  /** 点击事件处理函数 */
  onClick?: (event: MouseEvent) => void | Promise<unknown>
}

/**
 * 确认弹窗属性配置
 */
export interface PopconfirmProps {
  title?: string | VNode
  description?: string | VNode
  okText?: string
  cancelText?: string
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
 * ProButton 属性类型别名
 */
export type ProButtonProps = Props

// ======================
// 默认配置
// ======================

export const DEFAULT_PRO_BUTTON_PROPS = {
  autoLoading: false,
  enableConfirm: false,
  popConfig: () => ({
    title: '提示',
    description: '确定删除吗？',
    okText: '确定',
    cancelText: '取消'
  })
}

// ======================
// 工具函数
// ======================

/**
 * 检查是否为 Promise
 */
export function isPromise<T = any>(value: any): value is Promise<T> {
  return value && typeof value.then === 'function' && typeof value.catch === 'function'
}

/**
 * 检查是否为函数
 */
export function isFunction(value: any): value is Function {
  return typeof value === 'function'
}
