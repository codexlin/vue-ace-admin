/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description: 系统用户管理API
 */
import request from '@/utils/axios'

const SYSTEM_USER_PREFIX = '/system/user'

export const userApi = {
  // 获取用户列表
  getUserList: <T, V>(params: V) => request.get<T>(`${SYSTEM_USER_PREFIX}/list`, { params }),

  // 获取用户详情
  getUserDetail: <T>(id: number) => request.get<T>(`${SYSTEM_USER_PREFIX}/${id}`),

  // 创建用户
  createUser: <T, V>(data: V) => request.post<T, V>(`${SYSTEM_USER_PREFIX}`, data),

  // 更新用户
  updateUser: <T, V>(id: number, data: V) => request.put<T, V>(`${SYSTEM_USER_PREFIX}/${id}`, data),

  // 删除用户
  deleteUser: <T>(id: number) => request.delete<T>(`${SYSTEM_USER_PREFIX}/${id}`),

  // 重置密码
  resetPassword: <T, V>(id: number, data?: V) => request.post<T, V>(`${SYSTEM_USER_PREFIX}/${id}/reset-password`, data),

  // 批量删除用户
  batchDeleteUsers: <T, V>(ids: V) => request.delete<T, V>(`${SYSTEM_USER_PREFIX}/batch`, { data: ids }),

  // 导入用户
  importUsers: <T, V>(data: V) => request.post<T, V>(`${SYSTEM_USER_PREFIX}/import`, data),

  // 导出用户
  exportUsers: <T, V>(params: V) => request.get<T>(`${SYSTEM_USER_PREFIX}/export`, { params })
}
