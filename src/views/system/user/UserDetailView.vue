<template>
  <StandardDetailPage
    :id="userId"
    :api="userApi.getUserDetail"
    title="用户详情"
    :detail-fields="detailFields"
    :statistics="statistics"
    :tabs="tabs"
    @back="handleBack"
    @tab-change="handleTabChange"
  />
</template>

<script setup lang="ts">
import type { DetailField, StatisticConfig, TabConfig } from '@/types/template'

import { userApi } from './api'

const route = useRoute()
const router = useRouter()

const userId = computed(() => route.params.id as string)

// 详情字段配置
const detailFields: DetailField[] = [
  {
    key: 'id',
    label: '用户ID',
    type: 'text'
  },
  {
    key: 'userName',
    label: '用户名',
    type: 'text'
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'text'
  },
  {
    key: 'phone',
    label: '手机号',
    type: 'text'
  },
  {
    key: 'userType',
    label: '用户类型',
    type: 'status',
    options: [
      { label: '管理员', value: 'admin', color: 'red' },
      { label: '普通用户', value: 'user', color: 'blue' }
    ]
  },
  {
    key: 'sex',
    label: '性别',
    type: 'status',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
      { label: '其他', value: 'other' }
    ]
  },
  {
    key: 'status',
    label: '状态',
    type: 'status',
    options: [
      { label: '正常', value: 1, color: 'green' },
      { label: '禁用', value: 0, color: 'red' }
    ]
  },
  {
    key: 'createTime',
    label: '创建时间',
    type: 'date'
  },
  {
    key: 'lastLoginTime',
    label: '最后登录时间',
    type: 'date'
  },
  {
    key: 'avatar',
    label: '头像',
    type: 'image',
    formatter: (value) => value || '暂无头像'
  }
]

// 统计卡片配置
const statistics: StatisticConfig[] = [
  {
    key: 'loginCount',
    title: '登录次数',
    value: (data) => data.loginCount || 0
  },
  {
    key: 'orderCount',
    title: '订单数量',
    value: (data) => data.orderCount || 0,
    suffix: '单'
  },
  {
    key: 'totalAmount',
    title: '消费总额',
    value: (data) => data.totalAmount || 0,
    prefix: '¥',
    precision: 2
  },
  {
    key: 'points',
    title: '积分',
    value: (data) => data.points || 0,
    valueStyle: { color: '#3f8600' }
  }
]

// 标签页配置
const tabs: TabConfig[] = [
  {
    key: 'orders',
    title: '订单记录',
    component: defineAsyncComponent(() => import('./components/UserOrders.vue'))
  },
  {
    key: 'logs',
    title: '操作日志',
    component: defineAsyncComponent(() => import('./components/UserLogs.vue'))
  },
  {
    key: 'permissions',
    title: '权限信息',
    component: defineAsyncComponent(() => import('./components/UserPermissions.vue'))
  }
]

// 返回处理
const handleBack = () => {
  router.back()
}

// 标签页切换
const handleTabChange = (key: string) => {
  console.log('Tab changed:', key)
}
</script>
