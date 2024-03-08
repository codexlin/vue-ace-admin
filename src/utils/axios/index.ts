import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import {
  handleAuthError,
  handleChangeRequestHeader,
  handleConfigureAuth,
  handleGeneralError,
  handleNetworkError
} from './config'

// 请求通用返回结果(与后端沟通好结构)
export interface IResponse<T> {
  data: T | null
  code: number
  message: string
}
// 可自定义实例
export class Request {
  private instance: AxiosInstance
  // 默认配置
  private defaultConfig: AxiosRequestConfig = {
    // 根据实际情况修改
    baseURL: import.meta.env.VITE_APP_BASE_API,
    // 默认超时时间
    timeout: 6000
  }
  constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create({ ...config, ...this.defaultConfig })
    /**
     * 请求拦截
     * todo 可增加loading
     * 我们需要两块内容，一是请求的调整 ，二是 配置用户标识
     */
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config = handleChangeRequestHeader(config)
        // if (!useAuthStore().getToken) return config
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
      (response: AxiosResponse) => {
        // 响应成功的处理(2xx)
        console.log('响应后拦截器：', response)
        if (response.status !== 200) return Promise.reject(response.data)
        // const isArrayBuffer = response.request.responseType === 'arrayBuffer'
        // const isBlob = response.request.responseType === 'blob'
        handleAuthError(response.data.code)
        handleGeneralError(response)
        return response.data
      },
      (error: AxiosError) => {
        // 响应错误时的处理(4xx,5xx等)
        console.error('响应后捕获的错误：', error)
        handleNetworkError(error?.response?.status as number)
        // Promise.reject(error.response)
        return Promise.reject(error)
      }
    )
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
}
// 导出默认实例
export default new Request()
