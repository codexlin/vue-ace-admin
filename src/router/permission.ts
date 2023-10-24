/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-06-03 20:36:11
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router'
// 后端获取菜单路由与前端路由匹配
const matchRouter = function (routerList: RouteRecordRaw[], getRouter: RouteRecordRaw[] = []) {
  const matchArray: RouteRecordRaw[] = []
  routerList.forEach((item) => {
    getRouter.forEach((val) => {
      if (val.path === item.path) {
        if (val['children'] && val.children.length > 0) {
          matchRouter(val.children, item.children)
        }
        matchArray.push(item)
      }
    })
  })
  return matchArray
}

export default matchRouter
