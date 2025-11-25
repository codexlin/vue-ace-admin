/**
 * 标准化模板类型定义
 */

// 操作按钮配置
export interface ActionConfig {
  type: 'primary' | 'default' | 'danger' | 'link' | 'ghost'
  label: string
  key?: string
  auth?: string
  icon?: any
  handler: (record?: any) => void | Promise<void>
  disabled?: boolean
  loading?: boolean
  confirm?: {
    title?: string
    content?: string
    okText?: string
    cancelText?: string
  }
}

// 搜索字段配置
export interface SearchField {
  name: string
  label: string
  component: string
  defaultValue?: any
  placeholder?: string
  props?: Record<string, any>
  rules?: any[]
  options?: Array<{ label: string; value: any }>
  span?: number
  show?: boolean
}

// 表格列配置
export interface ColumnConfig {
  title: string
  dataIndex: string
  key?: string
  width?: number
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  sorter?: boolean
  filters?: Array<{ text: string; value: any }>
  render?: (value: any, record: any, index: number) => any
  customRender?: ({ record, value, index }: any) => any
  children?: ColumnConfig[]
}

// 详情字段配置
export interface DetailField {
  key: string
  label: string
  type: 'text' | 'date' | 'image' | 'tag' | 'link' | 'status'
  span?: number
  formatter?: (value: any) => string
  options?: Array<{ label: string; value: any; color?: string }>
  href?: string
  target?: string
}

// 统计卡片配置
export interface StatisticConfig {
  key: string
  title: string
  value: number | string
  prefix?: any
  suffix?: string
  precision?: number
  span?: number
  valueStyle?: Record<string, any>
}

// 标签页配置
export interface TabConfig {
  key: string
  title: string
  component: any
  props?: Record<string, any>
}

// 表单字段配置
export interface FormField {
  name: string
  label: string
  component: string
  defaultValue?: any
  placeholder?: string
  props?: Record<string, any>
  rules?: any[]
  options?: Array<{ label: string; value: any }>
  span?: number
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  show?: boolean
  dependencies?: string[]
  onChange?: (value: any) => void
}

// 步骤配置
export interface StepConfig {
  title: string
  description?: string
  component?: any
  validator?: () => Promise<boolean>
}

// 列表页配置
export interface ListPageConfig {
  api: (params: any) => Promise<any>
  searchFields?: SearchField[]
  tableColumns?: ColumnConfig[]
  toolbarActions?: ActionConfig[]
  rowActions?: ActionConfig[]
  title?: string
  showSearch?: boolean
  isZebra?: 'odd' | 'even' | 'none'
  immediate?: boolean
  debounce?: number
  pagination?: {
    pageSize?: number
    showSizeChanger?: boolean
    showQuickJumper?: boolean
  }
}

// 详情页配置
export interface DetailPageConfig {
  api: (id: string | number) => Promise<any>
  id: string | number
  detailFields?: DetailField[]
  statistics?: StatisticConfig[]
  tabs?: TabConfig[]
  title?: string
  showBack?: boolean
  backUrl?: string
}

// 编辑页配置
export interface EditPageConfig {
  saveApi: (data: any) => Promise<any>
  detailApi?: (id: string | number) => Promise<any>
  id?: string | number
  formFields: FormField[]
  mode: 'create' | 'edit'
  title?: string
  steps?: StepConfig[]
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelCol?: { span: number }
  wrapperCol?: { span: number }
}

// 表格操作按钮
export interface TableAction {
  key: string
  label: string
  type?: 'link' | 'button'
  danger?: boolean
  auth?: string
  icon?: any
  onClick: (record: any) => void | Promise<void>
  disabled?: (record: any) => boolean
  show?: (record: any) => boolean
}
