/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-04-20 17:41:06
 * @Description: 配置处理
 */
import { useUserStore } from '@/stores/modules/user'
import { message } from 'ant-design-vue'
import type { AxiosResponse } from 'axios'

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
  let errMessage = '未知错误'
  if (errStatus) {
    errMessage = errObj.get(errStatus) ?? `其他连接错误 --${errStatus}`
  } else {
    errMessage = `无法连接到服务器！`
  }
  message.error(errMessage)
}

/**
 * 响应拦截 授权错误处理
 * @param errno
 */
export const handleAuthError = (errno: string) => {
  const authErrMap: any = {
    '10031': '登录失效，需要重新登录', // token 失效
    '10032': '您太久没登录，请重新登录~', // token 过期
    '10033': '账户未绑定角色，请联系管理员绑定角色',
    '10034': '该用户未注册，请联系管理员注册用户',
    '10035': 'code 无法获取对应第三方平台用户',
    '10036': '该账户未关联员工，请联系管理员做关联',
    '10037': '账号已无效',
    '10038': '账号未找到'
  }

  if (Object.hasOwn(authErrMap, errno)) {
    message.error(authErrMap[errno])
    // 授权错误，登出账户
    useUserStore().logout()
    return false
  }

  return true
}
/**
 * 响应拦截 普通错误处理
 * @param errno
 * @param errMsg
 */
export const handleGeneralError = (response: AxiosResponse) => {
  const { data, config } = response
  if (data.code) {
    const { code, message: msg } = data
    console.log('handleGeneralError', code)
    message.error(msg)
    return false
  }
  if (config.url === '/user/captcha') {
    return !!data
  }
  console.log('handleGeneralError->结束')
  return true
}
