/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description:
 */
import Request from '@/utils/axios'

const prefix = '/user'
export const loginApi = <T, V>(data: V) => Request.post<T, V>(prefix + '/login', data)
export const registerApi = <T, V>(data: V) => Request.post<T, V>(prefix + '/register', data)
export const backendRoutesApi = () => Request.get(prefix + '/getMenu')
export const getCaptcha = <T>() =>
  Request.get<T>(prefix + '/cap', {
    responseType: 'arraybuffer'
  })
