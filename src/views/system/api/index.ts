import request from '@/utils/axios'
const MENU_PREFIX = '/menu'
export const getMenuTreeList = () => request.get(`${MENU_PREFIX}/listTree`)
export const getMenuList = () => request.get(`${MENU_PREFIX}/list`)
export const addMenu = <T, V>(data: V) => request.post<T, V>(`${MENU_PREFIX}/add`, data)
export const updateMenu = <T, V>(data: V) => request.put<T, V>(`${MENU_PREFIX}/update`, data)
export const deleteMenu = <T>(param: number) => request.delete<T>(`${MENU_PREFIX}/delete${param}`)
export const getDetail = <T>(param: number) => request.delete<T>(`${MENU_PREFIX}/getInfo${param}`)
