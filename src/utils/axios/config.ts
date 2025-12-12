import { message as antMsg } from 'ant-design-vue'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { IResponse } from '../axios'
import { useUserStore } from '@/stores/modules/user'

/**
 * 业务错误码枚举
 */
export enum BusinessErrorCode {
  SUCCESS = '0',
  TOKEN_INVALID = '10031',
  TOKEN_EXPIRED = '10032',
  NO_ROLE_BINDING = '10033',
  USER_NOT_REGISTERED = '10034',
  THIRD_PARTY_USER_ERROR = '10035',
  NO_EMPLOYEE_BINDING = '10036',
  ACCOUNT_INVALID = '10037',
  ACCOUNT_NOT_FOUND = '10038'
}

/**
 * 判断值是否为业务错误码枚举中的成员
 */
function isBusinessCode(x: unknown): x is BusinessErrorCode {
  return Object.values<BusinessErrorCode>(BusinessErrorCode).includes(x as BusinessErrorCode)
}

/**
 * 请求的调整 可以给请求头带上token等
 * @param config Axios请求配置
 * @returns 修改后的配置
 */
export const handleChangeRequestHeader = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // api mock用（生产环境应移除）
  if (import.meta.env.DEV) {
    config.headers.apifoxToken = 'dROD5webTSINtKEixUxWWBYNnjoRsSXn'
  }

  // 添加 token
  const token = useUserStore().getToken
  if (token) {
    config.headers.token = token
  }

  // 添加请求时间戳（防止缓存）
  if (config.method?.toLowerCase() === 'get') {
    config.params = {
      ...config.params,
      _t: Date.now()
    }
  }

  return config
}

/**
 * 配置用户标识
 * @param config Axios请求配置
 * @returns 修改后的配置
 */
export const handleConfigureAuth = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // 可在此添加 Authorization header
  // config.headers['Authorization'] = `Bearer ${useUserStore().getToken}`
  return config
}
/**
 * HTTP状态码错误消息映射
 */
const HTTP_ERROR_MESSAGES = new Map<number, string>([
  [301, '请求资源被永久移动到新位置,请访问我们的新网址'],
  [302, '我们的网站正在维护中'],
  [400, '请检查您的输入是否正确，或者联系管理员获得帮助'],
  [401, '未授权，请先登录或注册，以访问此资源'],
  [403, '您正在尝试访问未授权的资源，请联系管理员获得进一步帮助'],
  [404, '您请求的页面不存在，请检查您访问的网址是否正确'],
  [405, '请求方法未允许'],
  [408, '我们的服务器响应时间较长，请您稍后再试'],
  [500, '很抱歉，系统似乎出了些问题，请稍后再试'],
  [501, '网络未实现'],
  [502, '网络错误'],
  [503, '服务不可用'],
  [504, '网络超时'],
  [505, 'HTTP版本不支持该请求']
])

/**
 * 处理网络错误
 * @param errStatus HTTP状态码
 */
export const handleNetworkError = (errStatus: number): void => {
  const errMessage = errStatus
    ? HTTP_ERROR_MESSAGES.get(errStatus) || `其他连接错误 (${errStatus})`
    : '无法连接到服务器！'
  antMsg.error(errMessage)
}

/**
 * 授权错误消息映射
 */
const AUTH_ERROR_MESSAGES: Record<BusinessErrorCode, string> = {
  [BusinessErrorCode.SUCCESS]: '',
  [BusinessErrorCode.TOKEN_INVALID]: '登录失效，需要重新登录',
  [BusinessErrorCode.TOKEN_EXPIRED]: '您太久没登录，请重新登录~',
  [BusinessErrorCode.NO_ROLE_BINDING]: '账户未绑定角色，请联系管理员绑定角色',
  [BusinessErrorCode.USER_NOT_REGISTERED]: '该用户未注册，请联系管理员注册用户',
  [BusinessErrorCode.THIRD_PARTY_USER_ERROR]: 'code 无法获取对应第三方平台用户',
  [BusinessErrorCode.NO_EMPLOYEE_BINDING]: '该账户未关联员工，请联系管理员做关联',
  [BusinessErrorCode.ACCOUNT_INVALID]: '账号已无效',
  [BusinessErrorCode.ACCOUNT_NOT_FOUND]: '账号未找到'
}

/**
 * 处理授权错误
 * @param code 业务错误码
 * @returns 是否为授权错误
 */
const handleAuthError = (code: string | number): boolean => {
  const normalized: BusinessErrorCode = isBusinessCode(code) ? code : (String(code) as BusinessErrorCode)
  const errMessage = AUTH_ERROR_MESSAGES[normalized]

  if (errMessage) {
    antMsg.error(errMessage)
    void useUserStore().logout()
    return false
  }
  return true
}

/**
 * 处理普通业务错误
 * @param response Axios响应对象
 * @returns 是否成功
 */
const handleGeneralError = <T>(response: AxiosResponse<IResponse<T>>): boolean => {
  const { data, config } = response

  // 验证码接口特殊处理
  if (config.url === '/user/captcha') {
    return !!data
  }

  // 业务成功（通过类型守卫收窄为枚举后再比较，兼容数字/字符串）
  const rawCode = data.code
  const normalizedCode = isBusinessCode(rawCode) ? rawCode : String(rawCode)
  if (isBusinessCode(normalizedCode) && normalizedCode === BusinessErrorCode.SUCCESS) {
    return true
  }

  // 业务错误
  antMsg.error(data.msg || '操作失败')
  return false
}

/**
 * 主要的Axios响应处理函数
 * @param response Axios响应对象
 * @returns 处理后的数据或Promise.reject
 */
export function handleResponseData<T>(response: AxiosResponse<IResponse<T>>): IResponse<T> | Promise<never> {
  const { data } = response

  // 认证错误处理
  if (!handleAuthError(data.code)) {
    return Promise.reject(new Error('认证错误'))
  }

  // 业务错误处理
  if (!handleGeneralError(response)) {
    return Promise.reject(new Error(data.msg || '业务处理失败'))
  }

  return data
}
