export const dynamicRoutes = [
  {
    path: '/', //默认首页
    name: 'home',
    component: () => import('@/layout/index.vue'),
    hidden: true,
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        meta: {
          title: '首页',
          icon: 'House'
        },
        component: () => import('@/views/dashboard/DashboardView.vue')
      },
      {
        path: '/retail',
        name: 'retail',
        meta: {
          title: '零售管理',
          icon: 'House'
        },
        component: () => import('@/views/management/retail/RetailView.vue')
      },
      {
        path: '/inventory',
        name: 'inventory',
        meta: {
          title: '库存管理',
          icon: 'House'
        },
        component: () => import('@/views/management/inventory/InventoryView.vue')
      }
    ]
  }
]
