import request from '@/utils/axios'
const prefix = '/menu'
export const getMenuTreeList = () => request.get(prefix + '/listTree')
