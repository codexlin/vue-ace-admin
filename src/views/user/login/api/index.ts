import Request from '@/utils/axios/request'

export const loginApi = <T>(data: T) => Request.post('/login', data)
export const registerApi = <T>(data: T) => Request.post('/register', data)
