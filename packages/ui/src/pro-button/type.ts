import type { ButtonProps as AntButtonProps } from 'ant-design-vue'
import type { VNode } from 'vue'

export type { AntButtonProps }

/**
 * ProButton 组件属性定义（只包含扩展属性）
 */
export type ProButtonProps = AntButtonProps & {
  /** 是否自动显示 loading 状态 */
  autoLoading?: boolean
  /** 是否启用确认弹窗 */
  enableConfirm?: boolean
  /** 确认弹窗配置 */
  popConfig?: ConfirmProps
}

/**
 * 确认弹窗属性配置
 */
export interface ConfirmProps {
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
