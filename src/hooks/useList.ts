import { message as AntMessage } from 'ant-design-vue'
import type { ComputedRef, Ref } from 'vue'

export interface MessageType {
  GET_DATA_IF_FAILED?: string
  GET_DATA_IF_SUCCEED?: string
  EXPORT_DATA_IF_FAILED?: string
  EXPORT_DATA_IF_SUCCEED?: string
}
// options类型
export interface OptionsType {
  requestSuccess?: () => void
  requestError?: () => void
  message: MessageType
}

const DEFAULT_MESSAGE = {
  GET_DATA_IF_FAILED: '获取列表数据失败',
  EXPORT_DATA_IF_FAILED: '导出数据失败'
}

const DEFAULT_OPTIONS: OptionsType = {
  message: DEFAULT_MESSAGE
}

export function message(message: string) {
  AntMessage.success(message)
}

export function warningMessage(message: string) {
  AntMessage.warning(message)
}

export function errorMessage(message: string) {
  AntMessage.error(message)
}

export function infoMessage(message: string) {
  AntMessage.info(message)
}
type ListRequestFnType = ((params?: any) => void | Promise<any>) | ComputedRef<(params?: any) => void | Promise<any>>
// hooks参数
interface Props {
  listRequestFn: ListRequestFnType
  filterOption?: Ref<object>
  options?: OptionsType
}

export default function useList<ItemType extends object, FilterOption extends object>({
  listRequestFn,
  filterOption,
  options
}: Props) {
  // 加载态
  const loading = ref(false)
  // 当前页
  const curPage = ref(1)
  // 总数量
  const total = ref(0)
  // 分页大小
  const pageSize = ref(10)
  const dataSource = ref<ItemType[]>([])
  // 过滤数据
  // 获取列表数据
  const loadData = async (page = curPage.value) => {
    const params = { pageSize: pageSize.value, pageNum: page, ...filterOption?.value }
    // 设置加载中
    loading.value = true
    try {
      const r = await (isRef(listRequestFn) ? listRequestFn.value(params) : listRequestFn(params))
      dataSource.value = r?.data || r?.data?.list || r || []
      total.value = r?.data?.total || 0
      options?.message?.GET_DATA_IF_SUCCEED && message(options.message.GET_DATA_IF_SUCCEED)
      options?.requestSuccess?.()
    } catch (error) {
      console.error('loadData', error)
      options?.message?.GET_DATA_IF_FAILED && errorMessage(options.message.GET_DATA_IF_FAILED)
      // 执行失败钩子
      options?.requestError?.()
    } finally {
      // 关闭加载中
      loading.value = false
    }
  }
  // 监听分页数据改变
  watch([curPage, pageSize], () => {
    loadData(curPage.value)
  })
  const reset = () => {
    if (!filterOption?.value) return
    const keys = Reflect.ownKeys(filterOption.value)
    filterOption.value = {} as FilterOption
    keys.forEach((key) => {
      Reflect.set(filterOption.value!, key, undefined)
    })
    loadData()
  }

  return {
    dataSource,
    loading,
    reset,
    curPage,
    pageSize,
    total,
    loadData
  }
}
