/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description:
 */
import request from '@/utils/axios'

const USER_PREFIX = '/user'

/**
 * 获取验证码 - 自动重试 2 次
 */
export const getCaptcha = <T>() =>
  request.get<T>(`${USER_PREFIX}/captcha`, {
    responseType: 'arraybuffer',
    retry: 2,
    retryDelay: 1000
  })

/**
 * 获取后端路由 - 仅重试 1 次（避免连接拒绝时过度重试）
 */
export const backendRoutesApi = () =>
  request.get(`${USER_PREFIX}/getMenu`, {
    retry: 1,
    retryDelay: 500
  })

/**
 * 登录接口 - 不重试，避免重复提交
 * @param data - 登录数据 { email, password, captcha }
 * @returns 返回用户信息和 token
 */
export const loginApi = <TData = any>(data: TData) => request.post<unknown, TData>(`${USER_PREFIX}/login`, data)

/**
 * 注册接口 - 不重试，避免重复提交
 * @param data - 注册数据
 * @returns 返回结果
 */
export const registerApi = <TData = any>(data: TData) => request.post<unknown, TData>(`${USER_PREFIX}/register`, data)
export const getDetail = <T>(param: number) => request.get<T>(`${USER_PREFIX}/getInfo${param}`)
export const deleteUser = <T>(param: number) => request.delete<T>(`${USER_PREFIX}/delete${param}`)
export const updateUser = <T>(data: T) => request.put<T>(`${USER_PREFIX}/update`, data)
