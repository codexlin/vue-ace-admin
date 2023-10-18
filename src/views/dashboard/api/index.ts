import request from '@/utils/axios/request'

export const getUserList = () => request.get('/getUserList')
