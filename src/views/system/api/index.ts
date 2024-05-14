import request from '@/utils/axios'

const MENU_PREFIX = '/menu'
const USER_PREFIX = '/user'
const ROLE_PREFIX = '/role'
export const getMenuTreeList = () => request.get(`${MENU_PREFIX}/listTree`)
export const getMenuList = <T>() => request.get<T>(`${MENU_PREFIX}/list`)
export const addMenu = <T, V>(data: V) => request.post<T, V>(`${MENU_PREFIX}/save`, data)
export const updateMenu = <T, V>(data: V) => request.put<T, V>(`${MENU_PREFIX}/update`, data)
export const deleteMenu = <T>(param: number) => request.delete<T>(`${MENU_PREFIX}/remove/${param}`)
export const getDetail = <T>(param: number) => request.get<T>(`${MENU_PREFIX}/getInfo/${param}`)
export const getUserList = <T>() => request.get<T>(`${USER_PREFIX}/list`)
export const addUser = <T, V>(data: V) => request.post<T, V>(`${USER_PREFIX}/save`, data)
export const updateUser = <T, V>(data: V) => request.put<T, V>(`${USER_PREFIX}/update`, data)
export const getRoleList = <T>() => request.get<T>(`${ROLE_PREFIX}/list`)
export const addRole = <T, V>(data: V) => request.post<T, V>(`${ROLE_PREFIX}/save`, data)
export const updateRole = <T, V>(data: V) => request.put<T, V>(`${ROLE_PREFIX}/update`, data)
export const deleteRole = <T>(param: number) => request.delete<T>(`${ROLE_PREFIX}/remove/${param}`)
export const updateUserRole = <T, V>(data: V) => request.post<T, V>(`userRoleEntity/setRole`, data)
