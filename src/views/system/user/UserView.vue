<script setup lang="ts">
import useList from '@/hooks/useList'
import { getUserList } from '../api'
import FormModal from '@/components/form/FormModal'

export interface IUser {
  avatar?: null
  createBy?: null
  createTime?: string
  delFlag?: string
  deptId?: null
  email?: string
  id?: number
  loginDate?: null
  loginIp?: null
  loginName?: null
  password?: string
  phone?: null
  pwdUpdateDate?: null
  remark?: null
  sex?: string
  status?: string
  updateBy?: null
  updateTime?: null
  userId?: number
  userName?: string
  userType?: string

  [property: string]: any
}

const { dataSource, loadData, loading } = useList({ listRequestFn: getUserList })
const columns = [
  {
    title: '用户ID',
    dataIndex: 'id'
  },
  {
    title: '用户名称',
    dataIndex: 'userName'
  },
  {
    title: '用户类型',
    dataIndex: 'userType'
  },
  {
    title: '邮箱',
    dataIndex: 'email'
  },
  {
    title: '手机号',
    dataIndex: 'phone'
  },
  {
    title: '性别',
    dataIndex: 'sex'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    slots: { customRender: 'operation' }
  }
]
const open = ref(false)
const formItems = ref([])
onMounted(async () => {
  await loadData()
  console.log('User View mounted')
})
</script>
<template>
  <div>
    <h1>User View</h1>
    <CommonTable :dataSource :loading :columns />
    <a-modal title="新增用户" v-model:open="open">
      <FormModal :formItems />
    </a-modal>
  </div>
</template>

<style scoped></style>
