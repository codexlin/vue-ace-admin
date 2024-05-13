<script setup lang="tsx">
import useList from '@/hooks/useList'
import { addRole, deleteRole, getUserList, updateRole } from '../api'
import FormModal from '@/components/form/FormModal'
import { OperationButtons } from '@/components'
import { ref } from 'vue'
import { useToggle } from '@vueuse/core'
import useLocalI18n from '@/hooks/useLocalI18n'
import { buildTreeDataSelect } from '@/utils/common/treeUtil'

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

interface State {
  type: 'add' | 'edit' | 'detail' | 'delete'
  id: number | null
}

const formRef = ref(null)

const handleOk = async () => {
  const data = formRef.value?.formState
  const res = clickType.value === 'add' ? await addRole(data) : await updateRole(data)
  if (res.code === '0') {
    toggle()
  }
  console.log('handleOk', res)
}
const [value, toggle] = useToggle()
const { tt } = useLocalI18n()
const formItems = ref()

const clickType = ref('add')
const handleClick = async (record = null, type: State['type']) => {
  console.log(record)
  if (type === 'delete') {
    return await deleteRole(record?.id)
  }
  clickType.value = type
  toggle()
  await initFormItems()
}
const initFormItems = async () => {
  const treeData = await buildTreeDataSelect(tt)
  formItems.value = [
    {
      ui: 'a-input',
      name: 'roleName',
      label: '用户名称',
      disabled: false,
      placeholder: '请输入用户名'
    },
    {
      ui: 'a-tree-select',
      name: 'menuIds',
      label: '用户角色',
      allowClear: true,
      treeCheckable: true,
      placeholder: '请设置用户的角色',
      treeData
    },
    {
      ui: 'a-radio-group',
      name: 'status',
      label: '是否启用',
      defaultValue: '0',
      disabled: false,
      options: [
        { value: '0', label: '是' },
        { value: '1', label: '否' }
      ]
    }
  ]
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
    customRender: ({ record }: any) => {
      const items = [
        {
          auth: 'add',
          text: tt('common.add'),
          type: 'primary',
          cb: () => {
            handleClick(record, 'add')
          }
        },
        {
          auth: 'edit',
          text: tt('common.edit'),
          type: 'primary',
          cb: () => {
            handleClick(record, 'edit')
          }
        },
        {
          auth: 'delete',
          text: tt('common.delete'),
          type: 'danger',
          cb: () => {
            handleClick(record, 'delete')
          }
        }
      ]
      return <OperationButtons items={items} />
    }
  }
]
const open = ref(false)

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
