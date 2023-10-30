import type { RouteRecordRaw } from 'vue-router'

const Login = () => import('@/views/user/login/index.vue')
// const Home = () => import('@/views/dashboard/index.vue')
const Layout = () => import('@/layout/index.vue')
const Page404 = () => import('@/views/NotFound.vue')

// 基础路由，不需要设置权限
export const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    meta: {
      requiresAuth: true // 在这里设置，表示layout下边的子路由全部需要登录才能访问
    },
    redirect: '/dashboard',
    children: []
  },
  {
    path: '/:pathMatch(.*)',
    name: 'page404',
    component: Page404,
    meta: {
      title: '404'
    }
  }
]
