/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description:
 */
import Request from '@/utils/axios/request'

const prefix = '/user'
export const loginApi = <T>(data: T) => Request.post(prefix + '/login', data)
export const registerApi = <T>(data: T) => Request.post(prefix + '/register', data)
export const backendRoutesApi = () => Request.get(prefix + '/getMenu')
