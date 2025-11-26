import type { RouteRecordRaw } from 'vue-router'

const Login = () => import('@/views/user/login/LoginView.vue')
// const Home = () => import('@/views/dashboard/MenuView.vue')
const Layout = () => import('@/layouts/LayoutView.vue')
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
    children: [
      {
        path: '/test-components/antv',
        name: 'antv-test',
        component: () => import('@/views/testComponents/AntvTest.vue'),
        meta: {
          title: '组件库测试'
        }
      },
      // 模板演示页面
      {
        path: '/example/template-demo',
        name: 'template-demo',
        component: () => import('@/views/example/TemplateDemo.vue'),
        meta: {
          title: '模板组件演示',
          isCache: true
        }
      },
      // 用户管理（新版模板）
      {
        path: '/system/user-new',
        name: 'user-new',
        component: () => import('@/views/system/user/UserViewNew.vue'),
        meta: {
          title: '用户管理（新版）',
          isCache: true
        }
      }
    ]
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
