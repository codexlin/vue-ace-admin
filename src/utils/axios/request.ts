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

// 请求返回结果
export interface IResponse<T> {
  data: T | null
  code: number
  message: string
}

class Request {
  private instance: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
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
     * response.data 数据结构需要定好
     *
     */
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 对响应数据做点什么
        console.log('响应后拦截器：', response)
        if (response.status !== 200) return Promise.reject(response.data)
        handleAuthError(response.data.code)
        handleGeneralError(response.data.code, response.data.message)
        return response
      },
      (error: AxiosError) => {
        // 对响应错误做点什么
        console.error('响应后捕获的错误：', error)
        handleNetworkError(error?.response?.status as number)
        // Promise.reject(error.response)
        return Promise.reject(error)
      }
    )
  }

  public async get<T = object>(url: string, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    const response = await this.instance.get<IResponse<T>>(url, config)
    return response.data
  }

  public async post<T = object>(url: string, data: T, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    const response = await this.instance.post<IResponse<T>>(url, data, config)
    return response.data
  }

  public async put<T = object>(url: string, data?: T, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    const response = await this.instance.put<IResponse<T>>(url, data, config)
    return response.data
  }

  public async delete<T = object>(url: string, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    const response = await this.instance.delete<IResponse<T>>(url, config)
    return response.data
  }
}

const request = new Request({
  // 根据实际情况修改
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 默认超时时间
  timeout: 6000
})
export default request
