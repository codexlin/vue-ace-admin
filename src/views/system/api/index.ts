import request from '@/utils/axios'

const MENU_PREFIX = '/menu'
const USER_PREFIX = '/user'
const ROLE_PREFIX = '/role'

// ==================== 菜单相关 API ====================
/**
 * 获取菜单树 - 自动重试
 */
export const getMenuTreeList = () =>
  request.get(`${MENU_PREFIX}/listTree`, {
    retry: 2
  })

/**
 * 获取菜单列表 - 自动重试
 */
export const getMenuList = <T>() =>
  request.get<T>(`${MENU_PREFIX}/list`, {
    retry: 2
  })

/**
 * 添加菜单
 * @param data - 菜单数据
 * @returns 返回结果
 */
export const addMenu = <TData = any>(data: TData) => request.post<unknown, TData>(`${MENU_PREFIX}/save`, data)

/**
 * 更新菜单
 * @param data - 菜单数据
 * @returns 返回结果
 */
export const updateMenu = <TData = any>(data: TData) => request.put<unknown, TData>(`${MENU_PREFIX}/update`, data)

/**
 * 删除菜单
 */
export const deleteMenu = <T>(param: number) => request.delete<T>(`${MENU_PREFIX}/remove/${param}`)

/**
 * 获取菜单详情
 */
export const getDetail = <T>(param: number) =>
  request.get<T>(`${MENU_PREFIX}/getInfo/${param}`, {
    retry: 2
  })

// ==================== 用户相关 API ====================
/**
 * 获取用户信息和权限 - 自动重试
 */
export const getUserInfoAndPermission = <T>(param: number) =>
  request.get<T>(`${USER_PREFIX}/getUserInfoAndPermission/${param}`, {
    retry: 3,
    retryDelay: 1000
  })

/**
 * 获取用户角色信息 - 自动重试
 */
export const getUserRoleInfo = <T>(param: number) =>
  request.get<T>(`${USER_PREFIX}/getUserRoleInfo/${param}`, {
    retry: 2
  })

/**
 * 获取用户列表 - 支持防抖
 */
export const getUserList = <T>(params?: Record<string, any>) =>
  request.get<T>(`${USER_PREFIX}/list`, {
    params,
    debounce: true,
    debounceDelay: 300
  })
/**
 * 添加用户
 * @param data - 用户数据
 * @returns 返回结果
 */
export const addUser = <TData = any>(data: TData) => request.post<unknown, TData>(`${USER_PREFIX}/save`, data)

/**
 * 更新用户
 * @param data - 用户数据
 * @returns 返回结果
 */
export const updateUser = <TData = any>(data: TData) => request.put<unknown, TData>(`${USER_PREFIX}/update`, data)

// ==================== 角色相关 API ====================
/**
 * 获取角色列表 - 支持防抖
 */
export const getRoleList = <T>() =>
  request.get<T>(`${ROLE_PREFIX}/list`, {
    retry: 2,
    debounce: true,
    debounceDelay: 300
  })

/**
 * 获取角色详情 - 自动重试
 */
export const getRoleDetail = <T>(param: number) =>
  request.get<T>(`${ROLE_PREFIX}/getInfo/${param}`, {
    retry: 2
  })

/**
 * 添加角色
 * @param data - 角色数据
 * @returns 返回结果
 */
export const addRole = <TData = any>(data: TData) => request.post<unknown, TData>(`${ROLE_PREFIX}/save`, data)

/**
 * 更新角色
 * @param data - 角色数据
 * @returns 返回结果
 */
export const updateRole = <TData = any>(data: TData) => request.put<unknown, TData>(`${ROLE_PREFIX}/update`, data)

/**
 * 删除角色
 */
export const deleteRole = <T>(param: number) => request.delete<T>(`${ROLE_PREFIX}/remove/${param}`)

/**
 * 保存用户角色
 * @param data - 用户角色数据
 * @returns 返回结果
 */
export const saveUserRole = <TData = any>(data: TData) => request.post<unknown, TData>(`userRoleEntity/save`, data)

/**
 * 更新用户角色
 * @param data - 用户角色数据
 * @returns 返回结果
 */
export const updateUserRole = <TData = any>(data: TData) => request.put<unknown, TData>(`userRoleEntity/update`, data)
