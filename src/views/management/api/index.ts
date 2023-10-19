import request from '@/utils/axios/request'

export const getListWithPage = <T>(params: T) => request.get('/getListByPage', { params })
