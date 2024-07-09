/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-04-20 17:41:06
 * @Description: 配置处理
 */
import { message as antMsg } from 'ant-design-vue'
import type { AxiosResponse } from 'axios'
import type { IResponse } from '../axios'
import { useUserStore } from '@/stores/modules/user'

/**
 * 请求的调整 可以给请求头带上token等
 * config.headers.token / config.headers.Authorization
 * @param config
 */
export const handleChangeRequestHeader = (config: any) => {
  // api mock用
  config.headers.apifoxToken = 'dROD5webTSINtKEixUxWWBYNnjoRsSXn'
  config.headers.token = useUserStore().getToken || ''
  return config
}
/**
 * 配置用户标识
 * @param config
 */
export const handleConfigureAuth = (config: any) => {
  //   config.headers['Authorization'] = useAuthStore().getToken || ''
  return config
}
/**
 * 响应拦截 http网络错误处理
 * @param errStatus
 */
const errObj = new Map([
  [301, '请求资源被永久移动到新位置,请访问我们的新网址'],
  [302, '我们的网站正在维护中'],
  [400, '请检查您的输入是否正确，或者联系管理员获得帮助。'],
  [401, '未授权，请先登录或注册，以访问此资源。'],
  [403, '您正在尝试访问未授权的资源，请联系管理员获得进一步帮助。'],
  [404, '您请求的页面不存在，请检查您访问的网址是否正确。'],
  [405, '请求方法未允许'],
  [408, '我们的服务器响应时间较长，请您稍后再试。'],
  [500, '很抱歉，系统似乎出了些问题，请稍后再试。'],
  [501, '网络未实现'],
  [502, '网络错误'],
  [503, '服务不可用'],
  [504, '网络超时'],
  [505, 'http版本不支持该请求']
])

export const handleNetworkError = (errStatus: number) => {
  const errMessage = errStatus ? errObj.get(errStatus) || `其他连接错误 --${errStatus}` : `无法连接到服务器！`
  antMsg.error(errMessage)
}

// 主要的Axios响应处理函数 直接返回服务器结果
export function handleResponseData(response: AxiosResponse<IResponse<any>>) {
  const { data } = response
  try {
    handleError(response, data)
  } catch (error) {
    return Promise.reject(error)
  }
  return data // 返回处理后的数据
}

// 错误处理函数
function handleError(response: AxiosResponse<IResponse<any>>, data: IResponse<any>) {
  if (!handleAuthError(data.code)) {
    throw new Error('认证错误')
  }
  if (!handleGeneralError(response)) {
    throw new Error(data.msg)
  }
}

/**
 * 响应拦截 授权错误处理
 * @param errno
 */
const authErrorMessages: Record<string | number, string> = {
  '10031': '登录失效，需要重新登录', // token 失效
  '10032': '您太久没登录，请重新登录~', // token 过期
  '10033': '账户未绑定角色，请联系管理员绑定角色',
  '10034': '该用户未注册，请联系管理员注册用户',
  '10035': 'code 无法获取对应第三方平台用户',
  '10036': '该账户未关联员工，请联系管理员做关联',
  '10037': '账号已无效',
  '10038': '账号未找到'
}

const handleAuthError = (errno: string | number) => {
  const errMessage = authErrorMessages[errno]
  if (errMessage) {
    antMsg.error(errMessage)
    useUserStore().logout()
    return false
  }
  return true
}

/**
 * 响应拦截 普通业务错误处理
 * @param response
 */
const handleGeneralError = (response: AxiosResponse<IResponse<any>>) => {
  const { data, config } = response
  if (config.url === '/user/captcha') {
    return !!data
  }
  if (data.code !== '0') {
    const { msg } = data
    antMsg.error(msg)
    return false
  }
  return true
}
