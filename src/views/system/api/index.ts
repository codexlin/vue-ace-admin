import request from '@/utils/axios/request'
const prefix = '/menu'
export const getMenuTreeList = () => request.get(prefix + '/listTree')
