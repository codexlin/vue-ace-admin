import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import { handleChangeRequestHeader, handleConfigureAuth, handleNetworkError, handleResponseData } from './config'

// 请求通用返回结果(与后端沟通好结构)
export interface IResponse<T> {
  data: T | null
  code: string
  msg: string
}
export interface IStreamResponse {
  data: ReadableStream<Uint8Array> | null
  code: string
  msg: string
}
// 可自定义实例
export class Request {
  private instance: AxiosInstance
  // 默认配置
  private defaultConfig: AxiosRequestConfig = {
    // 根据实际情况修改
    baseURL: import.meta.env.VITE_APP_BASE_API,
    // 默认超时时间
    timeout: 60000
  }

  constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create({ ...config, ...this.defaultConfig })
    /**
     * 请求拦截 如 可增加loading
     * 我们需要两块内容，一是请求的调整 ，二是 配置用户标识
     */
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config = handleChangeRequestHeader(config)
        config = handleConfigureAuth(config)
        console.log('请求前拦截器：', config)
        return config
      },
      (error: unknown) => {
        // 对请求错误做些什么
        console.error('请求前捕获的错误：', error)
        return Promise.reject(error)
      }
    )
    /**
     * 响应拦截
     * 当我们将所有的错误类型处理函数写完，在 axios 的拦截器中进行调用即可。
     *
     */
    this.instance.interceptors.response.use(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (response: AxiosResponse<IResponse<any>>) => {
        console.log('响应后拦截器：', response)
        // 只处理 2xx 状态码
        if (response.status >= 200 && response.status < 300) {
          try {
            // if (response.config.responseType === 'stream') {
            //   const reader = response.data.getReader()
            //   const decoder = new TextDecoder('utf-8')
            //   console.log(decoder)
            // }
            return handleResponseData(response)
          } catch (error) {
            return error instanceof Error
              ? Promise.reject(error.message || '处理响应出现错误')
              : Promise.reject(error || '未知错误类型')
          }
        } else {
          return Promise.reject('非2xx的状态码：' + response.status)
        }
      },
      (error: AxiosError) => {
        // 所有请求失败情况都可以在这里捕获并处理
        console.error('响应后捕获的错误：', error)
        // 处理网络或其他错误
        if (error.response) {
          // 服务器响应了请求但有错误状态码
          handleNetworkError(error?.response?.status as number)
        } else if (error.request) {
          // 请求已发出但没有收到响应
          return Promise.reject('无响应：' + error.message)
        } else {
          // 在设置请求时触发了错误
          return Promise.reject('请求错误：' + error.message)
        }
      }
    )
  }
  // 取消请求
  public cancelTokenSource() {
    return axios.CancelToken.source()
  }
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    return this.instance.get(url, config)
  }

  public post<T = any, V = any>(url: string, data: V, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    return this.instance.post(url, data, config)
  }

  public put<T = any, V = any>(url: string, data?: V, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    return this.instance.put(url, data, config)
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    return this.instance.delete(url, config)
  }
  // 新增方法：处理文件流
  public async getFileStream(url: string, config?: AxiosRequestConfig): Promise<Blob> {
    const response = await this.instance.get(url, { ...config, responseType: 'blob' })
    return response.data
  }

  // 新增方法：处理文本流
  public async getTextStream(
    url: string,
    data: object,
    onData: (chunk: string) => void,
    config?: AxiosRequestConfig
  ): Promise<void> {
    const response = await this.instance.post(url, data, { ...config, responseType: 'stream' })
    const reader = response.data.getReader()
    const decoder = new TextDecoder('utf-8')
    console.log(decoder)
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      onData(chunk)
    }
  }
}

// 导出默认实例
export default new Request()
