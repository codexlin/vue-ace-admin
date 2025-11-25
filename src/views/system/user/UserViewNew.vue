<template>
  <StandardListPage
    title="用户管理"
    :api="userApi.getUserList"
    :search-fields="searchFields"
    :table-columns="tableColumns"
    :toolbar-actions="toolbarActions"
    :row-actions="rowActions"
    :is-zebra="'even'"
    @action="handleAction"
  />
</template>

<script setup lang="ts">
import { h } from 'vue'
import { message, errorMessage } from '@codexlin/ace-admin-ui'
import type { SearchField, ColumnConfig, ActionConfig } from '@/types/template'
import { userApi } from './api'

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    name: 'userName',
    label: '用户名',
    component: 'a-input',
    placeholder: '请输入用户名'
  },
  {
    name: 'email',
    label: '邮箱',
    component: 'a-input',
    placeholder: '请输入邮箱'
  },
  {
    name: 'phone',
    label: '手机号',
    component: 'a-input',
    placeholder: '请输入手机号'
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
  },
  {
    name: 'userType',
    label: '用户类型',
    component: 'a-select',
    defaultValue: '',
    props: {
      placeholder: '请选择用户类型',
      options: [
        { label: '全部', value: '' },
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' }
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
    width: 180
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 130
  },
  {
    title: '用户类型',
    dataIndex: 'userType',
    width: 100,
    render: (value) => {
      const typeMap = {
        admin: { text: '管理员', color: 'red' },
        user: { text: '普通用户', color: 'blue' }
      }
      const type = typeMap[value] || { text: value, color: 'default' }
      return h('a-tag', { color: type.color }, type.text)
    }
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 80,
    render: (value) => {
      const sexMap = {
        male: '男',
        female: '女',
        other: '其他'
      }
      return sexMap[value] || value
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
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
    handler: () => handleCreate()
  },
  {
    type: 'default',
    label: '批量导入',
    key: 'import',
    handler: () => handleImport()
  },
  {
    type: 'default',
    label: '导出',
    key: 'export',
    handler: () => handleExport()
  }
]

// 行操作
const rowActions: ActionConfig[] = [
  {
    type: 'link',
    label: '查看',
    key: 'view',
    handler: (record) => handleView(record)
  },
  {
    type: 'link',
    label: '编辑',
    key: 'edit',
    handler: (record) => handleEdit(record)
  },
  {
    type: 'link',
    label: '重置密码',
    key: 'reset',
    handler: (record) => handleResetPassword(record),
    confirm: {
      title: '确认重置密码',
      content: '确定要重置该用户的密码吗？'
    }
  },
  {
    type: 'link',
    label: '删除',
    key: 'delete',
    danger: true,
    handler: (record) => handleDelete(record),
    confirm: {
      title: '确认删除',
      content: '确定要删除该用户吗？删除后不可恢复！'
    }
  }
]

// 操作处理函数
const handleAction = (type: string, record?: any) => {
  console.log('Action:', type, record)
}

const handleCreate = () => {
  console.log('Create new user')
  // 跳转到创建页面
  // router.push('/system/user/create')
}

const handleImport = () => {
  console.log('Import users')
  // 打开导入弹窗
}

const handleExport = () => {
  console.log('Export users')
  // 导出用户数据
}

const handleView = (record: any) => {
  console.log('View user:', record)
  // 跳转到详情页面
  // router.push(`/system/user/${record.id}`)
}

const handleEdit = (record: any) => {
  console.log('Edit user:', record)
  // 跳转到编辑页面
  // router.push(`/system/user/edit/${record.id}`)
}

const handleResetPassword = async (record: any) => {
  console.log('Reset password:', record)
  try {
    await userApi.resetPassword(record.id)
    message.success('密码重置成功')
  } catch (error) {
    errorMessage('密码重置失败')
  }
}

const handleDelete = async (record: any) => {
  console.log('Delete user:', record)
  try {
    await userApi.deleteUser(record.id)
    message.success('用户删除成功')
  } catch (error) {
    errorMessage('用户删除失败')
  }
}
</script>
