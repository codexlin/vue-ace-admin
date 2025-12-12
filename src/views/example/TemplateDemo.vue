<template>
  <div class="template-demo">
    <h2>模板组件演示</h2>

    <!-- 列表页演示 -->
    <StandardListPage
      title="用户管理演示"
      :api="demoApi.getList"
      :search-fields="searchFields"
      :table-columns="tableColumns"
      :toolbar-actions="toolbarActions"
      :row-actions="rowActions"
      is-zebra="even"
    />
  </div>
</template>

<script setup lang="ts">
import type { SearchField, ColumnConfig, ActionConfig } from '@/types/template'

// 模拟API
const demoApi = {
  getList: async (params: any) => {
    // 模拟数据
    await new Promise((resolve) => setTimeout(resolve, 100)) // 模拟网络延迟
    return {
      data: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        userName: `用户${i + 1}`,
        email: `user${i + 1}@example.com`,
        status: i % 2 === 0 ? 1 : 0,
        createTime: new Date().toISOString()
      })),
      total: 100
    }
  }
}

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    name: 'userName',
    label: '用户名',
    component: 'a-input',
    placeholder: '请输入用户名'
  },
  {
    name: 'status',
    label: '状态',
    component: 'a-select',
    defaultValue: '',
    props: {
      placeholder: '请选择状态',
      options: [
        { label: '全部', value: '' },
        { label: '正常', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  }
]

// 表格列配置
const tableColumns: ColumnConfig[] = [
  {
    title: '用户ID',
    dataIndex: 'id',
    width: 80
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    width: 120
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 200
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (value) => {
      const statusMap = {
        1: { text: '正常', color: 'green' },
        0: { text: '禁用', color: 'red' }
      }
      const status = statusMap[value] || { text: value, color: 'default' }
      return h('a-tag', { color: status.color }, status.text)
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 160,
    render: (value) => (value ? new Date(value).toLocaleString() : '-')
  }
]

// 工具栏操作
const toolbarActions: ActionConfig[] = [
  {
    type: 'primary',
    label: '新增用户',
    key: 'create',
    handler: () => console.log('Create new user')
  },
  {
    type: 'default',
    label: '导出',
    key: 'export',
    handler: () => console.log('Export users')
  }
]

// 行操作
const rowActions: ActionConfig[] = [
  {
    type: 'link',
    label: '编辑',
    key: 'edit',
    handler: (record) => console.log('Edit user:', record)
  },
  {
    type: 'link',
    label: '删除',
    key: 'delete',
    danger: true,
    handler: (record) => console.log('Delete user:', record),
    confirm: {
      title: '确认删除',
      content: '确定要删除该用户吗？'
    }
  }
]
</script>

<style scoped>
.template-demo {
  padding: 20px;
}
</style>
