/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 23:47:18
 * @Description:
 */
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
export interface LayoutProviderData {
  currentRoute: RouteLocationNormalizedLoaded // 根据你的实际情况定义 currentRoute 的类型
  routes: RouteRecordRaw[]
  menus: RouteRecordRaw[]
}
