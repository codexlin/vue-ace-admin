import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type CancelTokenSource
} from 'axios'
import { handleChangeRequestHeader, handleConfigureAuth, handleNetworkError, handleResponseData } from './config'

/**
 * 请求通用返回结果(与后端沟通好结构)
 */
export interface IResponse<T> {
  data: T | null
  code: string
  msg: string
}

/**
 * 流式响应接口
 */
export interface IStreamResponse {
  data: ReadableStream<Uint8Array> | null
  code: string
  msg: string
}

/**
 * 请求配置扩展接口
 */
export interface RequestOptions extends AxiosRequestConfig {
  /** 是否启用重试 */
  retry?: number
  /** 重试延迟时间(ms) */
  retryDelay?: number
  /** 是否防抖 */
  debounce?: boolean
  /** 防抖延迟时间(ms) */
  debounceDelay?: number
  /** 是否显示 loading */
  showLoading?: boolean
  /** 是否显示错误消息 */
  showError?: boolean
}

/**
 * 请求统计信息
 */
interface RequestStats {
  url: string
  method: string
  startTime: number
  endTime?: number
  duration?: number
  status?: number
}

/**
 * HTTP 请求封装类
 */
export class Request {
  private instance: AxiosInstance
  private defaultConfig: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 60000
  }

  /** 默认重试配置 */
  private defaultRetry = 3
  private defaultRetryDelay = 1000

  /** 请求取消管理器 */
  private pendingRequests = new Map<string, CancelTokenSource>()

  /** 防抖请求管理器 */
  private debounceMap = new Map<string, ReturnType<typeof setTimeout>>()

  /** 请求统计 */
  private requestStats: RequestStats[] = []

  /** 并发请求数 */
  private concurrentRequests = 0

  /** 最大并发数 */
  private maxConcurrent = 10

  constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create({ ...this.defaultConfig, ...config })
    this.setupInterceptors()
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 记录请求开始时间
        const requestKey = this.getRequestKey(config)
        this.requestStats.push({
          url: config.url || '',
          method: config.method || 'get',
          startTime: Date.now()
        })

        // 并发控制
        this.concurrentRequests++
        if (this.concurrentRequests > this.maxConcurrent) {
          console.warn(`并发请求数过多: ${this.concurrentRequests}`)
        }

        // 取消重复请求
        this.cancelPendingRequest(requestKey)

        // 添加取消token
        const source = axios.CancelToken.source()
        config.cancelToken = source.token
        this.pendingRequests.set(requestKey, source)

        // 应用自定义配置
        config = handleChangeRequestHeader(config)
        config = handleConfigureAuth(config)

        return config
      },
      (error: unknown) => {
        this.concurrentRequests--
        if (import.meta.env.DEV) {
          console.error('请求配置错误：', error)
        }
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<any>) => {
        // 更新请求统计
        this.updateRequestStats(response)
        this.concurrentRequests--

        // 移除pending请求
        const requestKey = this.getRequestKey(response.config)
        this.pendingRequests.delete(requestKey)

        // 处理 2xx 状态码
        if (response.status >= 200 && response.status < 300) {
          // 返回处理后的数据，保持原response结构
          const result = handleResponseData(response)
          // 将处理后的结果放回response.data
          return Promise.resolve(result as any)
        }
        return Promise.reject(new Error(`HTTP状态码错误: ${response.status}`))
      },
      async (error: AxiosError) => {
        this.concurrentRequests--

        // 移除pending请求
        if (error.config) {
          const requestKey = this.getRequestKey(error.config)
          this.pendingRequests.delete(requestKey)
        }

        // 开发环境打印错误
        if (import.meta.env.DEV) {
          console.error('HTTP请求错误：', error)
        }

        // 请求被取消
        if (axios.isCancel(error)) {
          return Promise.reject(new Error('请求已取消'))
        }

        // 重试逻辑
        const config = error.config as RequestOptions
        if (config && this.shouldRetry(error, config)) {
          const retryCount = (config as any).__retryCount || 0
          const maxRetries = config.retry || this.defaultRetry

          if (retryCount < maxRetries) {
            ;(config as any).__retryCount = retryCount + 1
            const delay = config.retryDelay || this.defaultRetryDelay

            await new Promise((resolve) => setTimeout(resolve, delay))
            return this.instance.request(config)
          }
        }

        // 处理网络错误
        if (error.response) {
          handleNetworkError(error.response.status)
          return Promise.reject(error)
        } else if (error.request) {
          return Promise.reject(new Error(`无响应：${error.message}`))
        } else {
          return Promise.reject(new Error(`请求配置错误：${error.message}`))
        }
      }
    )
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetry(error: AxiosError, config: RequestOptions): boolean {
    const maxRetries = config.retry ?? this.defaultRetry
    const retryCount = (config as any).__retryCount || 0

    if (retryCount >= maxRetries) return false

    // 不重试连接被拒绝的错误（后端服务未启动）
    if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
      return false
    }

    // 只重试网络错误和 5xx 错误
    if (!error.response) return true
    if (error.response.status >= 500 && error.response.status < 600) return true

    return false
  }

  /**
   * 生成请求唯一key
   */
  private getRequestKey(config: AxiosRequestConfig | InternalAxiosRequestConfig): string {
    return `${config.method}:${config.url}:${JSON.stringify(config.params)}:${JSON.stringify(config.data)}`
  }

  /**
   * 取消pending请求
   */
  private cancelPendingRequest(requestKey: string): void {
    if (this.pendingRequests.has(requestKey)) {
      const source = this.pendingRequests.get(requestKey)
      source?.cancel('取消重复请求')
      this.pendingRequests.delete(requestKey)
    }
  }

  /**
   * 更新请求统计
   */
  private updateRequestStats(response: AxiosResponse<any>): void {
    const stat = this.requestStats.find(
      (s) => s.url === response.config.url && s.method === response.config.method && !s.endTime
    )
    if (stat) {
      stat.endTime = Date.now()
      stat.duration = stat.endTime - stat.startTime
      stat.status = response.status
    }

    // 只保留最近100条记录
    if (this.requestStats.length > 100) {
      this.requestStats = this.requestStats.slice(-100)
    }
  }
  /**
   * 创建取消token
   * @deprecated 使用 cancelRequest 或 cancelAllRequests 代替
   */
  public cancelTokenSource(): CancelTokenSource {
    return axios.CancelToken.source()
  }

  /**
   * 取消指定请求
   */
  public cancelRequest(url: string, method: string = 'get'): void {
    const key = `${method}:${url}::undefined:undefined`
    this.cancelPendingRequest(key)
  }

  /**
   * 取消所有pending请求
   */
  public cancelAllRequests(message: string = '取消所有请求'): void {
    this.pendingRequests.forEach((source) => {
      source.cancel(message)
    })
    this.pendingRequests.clear()
  }

  /**
   * 获取请求统计信息
   */
  public getRequestStats(): RequestStats[] {
    return [...this.requestStats]
  }

  /**
   * 清空请求统计
   */
  public clearStats(): void {
    this.requestStats = []
  }

  /**
   * 获取平均请求时间
   */
  public getAverageRequestTime(): number {
    const completedRequests = this.requestStats.filter((s) => s.duration)
    if (completedRequests.length === 0) return 0

    const totalDuration = completedRequests.reduce((sum, s) => sum + (s.duration || 0), 0)
    return Math.round(totalDuration / completedRequests.length)
  }
  /**
   * GET 请求
   * @template TResponse - 响应数据类型
   * @param url - 请求地址
   * @param config - 请求配置
   * @returns 返回 Promise 包裹的响应数据
   */
  public get<TResponse = any>(url: string, config?: RequestOptions): Promise<IResponse<TResponse>> {
    return this.request<TResponse>({ ...config, method: 'GET', url })
  }

  /**
   * POST 请求
   * @template TResponse - 响应数据类型
   * @template TData - 请求数据类型
   * @param url - 请求地址
   * @param data - 请求数据
   * @param config - 请求配置
   * @returns 返回 Promise 包裹的响应数据
   */
  public post<TResponse = any, TData = any>(
    url: string,
    data?: TData,
    config?: RequestOptions
  ): Promise<IResponse<TResponse>> {
    return this.request<TResponse>({ ...config, method: 'POST', url, data })
  }

  /**
   * PUT 请求
   * @template TResponse - 响应数据类型
   * @template TData - 请求数据类型
   * @param url - 请求地址
   * @param data - 请求数据
   * @param config - 请求配置
   * @returns 返回 Promise 包裹的响应数据
   */
  public put<TResponse = any, TData = any>(
    url: string,
    data?: TData,
    config?: RequestOptions
  ): Promise<IResponse<TResponse>> {
    return this.request<TResponse>({ ...config, method: 'PUT', url, data })
  }

  /**
   * DELETE 请求
   * @template TResponse - 响应数据类型
   * @param url - 请求地址
   * @param config - 请求配置
   * @returns 返回 Promise 包裹的响应数据
   */
  public delete<TResponse = any>(url: string, config?: RequestOptions): Promise<IResponse<TResponse>> {
    return this.request<TResponse>({ ...config, method: 'DELETE', url })
  }

  /**
   * PATCH 请求
   * @template TResponse - 响应数据类型
   * @template TData - 请求数据类型
   * @param url - 请求地址
   * @param data - 请求数据
   * @param config - 请求配置
   * @returns 返回 Promise 包裹的响应数据
   */
  public patch<TResponse = any, TData = any>(
    url: string,
    data?: TData,
    config?: RequestOptions
  ): Promise<IResponse<TResponse>> {
    return this.request<TResponse>({ ...config, method: 'PATCH', url, data })
  }

  /**
   * 通用请求方法（支持防抖）
   */
  private request<T>(config: RequestOptions): Promise<IResponse<T>> {
    // 防抖处理
    if (config.debounce) {
      const requestKey = this.getRequestKey(config)
      const existingTimer = this.debounceMap.get(requestKey)

      if (existingTimer) {
        clearTimeout(existingTimer)
      }

      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          this.debounceMap.delete(requestKey)
          this.instance
            .request(config)
            .then((res) => resolve(res as any))
            .catch(reject)
        }, config.debounceDelay || 300)

        this.debounceMap.set(requestKey, timer)
      })
    }

    return this.instance.request(config) as any
  }
  /**
   * 下载文件流
   */
  public async getFileStream(url: string, config?: RequestOptions): Promise<Blob> {
    const response = await this.instance.get(url, { ...config, responseType: 'blob' })
    return response.data
  }

  /**
   * 处理文本流
   */
  public async getTextStream(
    url: string,
    data: object,
    onData: (chunk: string) => void,
    config?: RequestOptions
  ): Promise<void> {
    const response = await this.instance.post(url, data, { ...config, responseType: 'stream' })
    const reader = response.data.getReader()
    const decoder = new TextDecoder('utf-8')

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      onData(chunk)
    }
  }

  /**
   * 批量请求（并行）
   */
  public all<T = any>(requests: Promise<IResponse<T>>[]): Promise<IResponse<T>[]> {
    return Promise.all(requests)
  }

  /**
   * 批量请求（串行）
   */
  public async sequence<T = any>(requests: (() => Promise<IResponse<T>>)[]): Promise<IResponse<T>[]> {
    const results: IResponse<T>[] = []
    for (const request of requests) {
      const result = await request()
      results.push(result)
    }
    return results
  }

  /**
   * 上传文件
   */
  public upload<T = any>(
    url: string,
    file: File | FormData,
    onProgress?: (progressEvent: any) => void,
    config?: RequestOptions
  ): Promise<IResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData()
    if (file instanceof File) {
      formData.append('file', file)
    }

    return this.post<T, FormData>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers
      },
      onUploadProgress: onProgress
    })
  }

  /**
   * 下载文件
   */
  public async download(url: string, filename?: string, config?: RequestOptions): Promise<void> {
    const blob = await this.getFileStream(url, config)
    const link = document.createElement('a')
    const objectUrl = URL.createObjectURL(blob)

    link.href = objectUrl
    link.download = filename || url.split('/').pop() || 'download'
    link.click()

    // 清理
    URL.revokeObjectURL(objectUrl)
  }
}

// 导出默认实例
export default new Request()
