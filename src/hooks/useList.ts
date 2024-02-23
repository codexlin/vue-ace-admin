import { message as AntMessage } from 'ant-design-vue'
import type { Ref } from 'vue'

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
// hooks参数
interface Props {
  listRequestFn: Function
  filterOption?: Ref<Object>
  exportRequestFn?: Function
  options?: OptionsType
}
export default function useList<ItemType extends Object, FilterOption extends Object>({
  listRequestFn,
  filterOption,
  exportRequestFn,
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
  const list = ref<ItemType[]>([])
  // 过滤数据
  // 获取列表数据
  const loadData = async (page = curPage.value) => {
    const params = { pageSize: pageSize.value, pageNum: page, ...filterOption?.value }
    // 设置加载中
    loading.value = true
    try {
      const r = await listRequestFn(params)
      list.value = r?.data || r?.data?.list || []
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
  // 传入的 exportRequestFn 函数接收的参数数量和类型是否正常对应上 请根据实际情况进行调整
  const exportFile = async () => {
    if (!exportRequestFn) {
      throw new Error('当前没有提供exportRequestFn函数')
    }
    if (typeof exportRequestFn !== 'function') {
      throw new Error('exportRequestFn必须是一个函数')
    }
    try {
      const {
        data: { link }
      } = await exportRequestFn(filterOption?.value)
      window.open(link)
      // 显示信息
      options?.message?.EXPORT_DATA_IF_SUCCEED && message(options.message.EXPORT_DATA_IF_SUCCEED)
      // 执行成功钩子
      // options?.exportSuccess?.()
    } catch (error) {
      // 显示信息
      options?.message?.EXPORT_DATA_IF_FAILED && errorMessage(options.message.EXPORT_DATA_IF_FAILED)
      // 执行失败钩子
      // options?.exportError?.()
    }
  }
  return {
    list,
    loading,
    reset,
    curPage,
    pageSize,
    total,
    loadData
  }
}
