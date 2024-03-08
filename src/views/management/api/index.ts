import request from '@/utils/axios'

export const getListWithPage = <T>(params: T) => request.get('/getListByPage', { params })
