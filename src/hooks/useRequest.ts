import { ref, type UnwrapRef } from 'vue'
import { debounce } from 'radash'
import type { IResponse } from '@/utils/axios'
/**
 * useRequest 简化 API 请求的管理。
 * 提供了加载状态、错误处理、响应数据等功能，并支持防抖和请求取消。
 *
 * @param api - 一个返回 Promise 的函数，通常是一个 API 请求函数。
 * @param defaultValue - 请求成功时的默认返回值，默认为空数组。
 * @param options - 可选参数对象，包含以下属性：
 *   - autoRun: boolean - 控制是否在 hooks 初始化时自动执行请求，默认为 true。
 *   - onSuccess: (data: any) => void - 请求成功时的回调函数。
 *   - onError: (error: Error) => void - 请求失败时的回调函数。
 */
export interface RequestOptions {
  autoRun?: boolean // 控制是否自动执行
  onSuccess?: (data: any) => void // 成功回调
  onError?: (error: Error) => void // 错误回调
}

export default function useRequest<T>(
  api: (...args: any[]) => Promise<IResponse<T>>,
  defaultValue = [] as unknown as T,
  options: RequestOptions = {}
) {
  const { autoRun = true, onSuccess, onError } = options

  const loading = ref(false)
  const error = ref<Error | null>(null)
  const response = ref<T>(defaultValue)
  let abortController: AbortController | null = null

  const execute = async (...args: any[]) => {
    // loading 检查，避免重复发起请求
    if (loading.value) return

    // 如果存在之前的请求，先取消
    if (abortController) {
      abortController.abort()
    }

    // 创建新的 AbortController
    abortController = new AbortController()
    loading.value = true
    error.value = null

    try {
      const boundApi = api.bind(null, ...args) // 绑定参数
      const res = await boundApi() // 调用绑定后的函数
      response.value = res.data as unknown as UnwrapRef<T>
      onSuccess?.(res.data)
      return res
    } catch (e) {
      // 如果是取消请求导致的错误，不处理
      if ((e as any)?.name === 'CanceledError') {
        return
      }
      const err = e as Error
      error.value = err
      onError?.(err)
      throw err
    } finally {
      loading.value = false
      abortController = null
    }
  }

  const debounceExecute = (delay: number) => {
    return debounce({ delay }, execute)
  }
  // 手动取消请求
  const cancel = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    loading.value = false
  }

  const reset = () => {
    cancel()
    error.value = null
    response.value = defaultValue
  }

  if (autoRun) {
    execute()
  }

  return {
    loading,
    error,
    response,
    execute,
    debounceExecute,
    refresh: execute,
    cancel,
    reset
  }
}
