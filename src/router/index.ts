/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-09 21:03:39
 * @Description:
 */
import { createRouter, createWebHistory } from 'vue-router'
//constantRoutes 静态路由 登陆，首页等。。。
export const constantRoutes = [
  {
    path: '/', //默认首页
    redirect: '/dashboard',
    hidden: true
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      title: '首页',
      icon: 'House'
    },
    component: () => import('@/views/dashboard/DashboardView.vue')
  }

  // {
  //   path: '/:pathMatch(.*)*', // 此写法解决动态路由页面刷新的 warning 警告
  //   component: () => import('@/views/user/error-page/404.vue'),
  //   hidden: true
  // }
]
//动态路由 asyncRoutes
export const asyncRoutes = []

const router = createRouter({
  history: createWebHistory(), // HTML5的history模式
  routes: constantRoutes
})

export default router
