/**
 * 单个字段配置
 */
export interface Field {
  /** 字段名（对应 model key） */
  name: string
  /** 字段标签 */
  label: string
  /** 表单项组件类型（如 'a-input', 'a-select'） */
  component?: string
  /** 组件属性 */
  props?: Record<string, any>
}

/**
 * ProSearchForm 组件属性
 */
export interface ProSearchFormProps {
  /** 字段配置数组 */
  fields: Field[]
  /** 默认值（非受控模式） */
  defaultValues?: Record<string, any>
  /** 表单数据（受控模式） */
  modelValue?: Record<string, any>
}

/**
 * 事件类型定义
 */
export type ProSearchFormEmits = {
  (e: 'update:modelValue', val: Record<string, any>): void
  (e: 'submit', val: Record<string, any>): void
  (e: 'reset'): void
}
