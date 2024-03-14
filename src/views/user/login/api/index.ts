/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description:
 */
import request from '@/utils/axios'

const USER_PREFIX = '/user'
export const getCaptcha = <T>() =>
  request.get<T>(`${USER_PREFIX}/captcha`, {
    responseType: 'arraybuffer'
  })
export const backendRoutesApi = () => request.get(`${USER_PREFIX}/getMenu`)
export const loginApi = <T, V>(data: V) => request.post<T, V>(`${USER_PREFIX}/login`, data)
export const registerApi = <T, V>(data: V) => request.post<T, V>(`${USER_PREFIX}/register`, data)
export const getDetail = <T>(param: number) => request.get<T>(`${USER_PREFIX}/getInfo${param}`)
export const deleteUser = <T>(param: number) => request.delete<T>(`${USER_PREFIX}/delete${param}`)
export const updateUser = <T>(data: T) => request.put<T>(`${USER_PREFIX}/update`, data)
