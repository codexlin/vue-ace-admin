import request from '@/utils/axios'

export const getUserList = () => request.get('/getUserList')
