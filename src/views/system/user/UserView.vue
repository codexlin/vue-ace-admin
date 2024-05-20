<script lang="tsx" setup>
import useList from '@/hooks/useList'
import { addRole, deleteRole, getRoleList, getUserInfoAndPermission, getUserList, updateUserRole } from '../api'
import FormModal from '@/components/form/FormModal'
import { OperationButtons } from '@/components'
import { ref } from 'vue'
import { useToggle } from '@vueuse/core'
import useLocalI18n from '@/hooks/useLocalI18n'

export interface IUser {
  avatar?: null
  createBy?: null
  createTime?: string
  delFlag?: string
  deptId?: null
  email?: string
  id: number
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
  userId: number
  userName?: string
  userType?: string

  [property: string]: any
}

interface State {
  type: 'add' | 'edit' | 'detail' | 'delete'
  id: number | null
}

const formRef = ref(null)
const recordData = ref()
const detailData = ref()

const handleOk = async () => {
  const data = formRef.value?.formState
  const userId = recordData.value.userId
  const res = clickType.value === 'add' ? await addRole(data) : await updateUserRole({ ...data, userId })
  if (res.code === '0') {
    toggle()
  }
  console.log('handleOk', res)
}
const [value, toggle] = useToggle()
const { tt } = useLocalI18n()
const formItems = ref()

const clickType = ref('add')
const initWithClickType = async (record: IUser) => {
  if (clickType.value === 'delete') {
    return await deleteRole(record?.id)
  }
  if (clickType.value !== 'add') {
    const res = await getUserInfoAndPermission(record?.userId)
    detailData.value = res.data
  }
}
const handleClick = async (record: IUser, type: State['type']) => {
  console.log(record)
  recordData.value = record
  clickType.value = type
  await initWithClickType(record)
  await initFormItems()
  toggle()
}
const title = computed(() => {
  const text = {
    add: '新增用户',
    edit: '编辑用户',
    detail: '用户详情'
  } as Record<string, string>
  return text[clickType.value]
})
const initFormItems = async () => {
  const res = await getRoleList<any[]>()
  const options = res.data?.map((i) => ({ value: i.roleId, label: i.roleName }))

  console.log(options)
  const initialFormItems = [
    {
      ui: 'a-select',
      name: 'roleIds',
      label: '用户角色',
      allowClear: true,
      placeholder: '请设置用户的角色',
      defaultValue: [],
      mode: 'multiple',
      options
    }
  ]
  // 更新表单项默认值，如果有详细数据存在
  if (detailData.value) {
    formItems.value = initialFormItems.map((item) => ({
      ...item,
      defaultValue: detailData.value[item.name] ?? item.defaultValue
    }))
  } else {
    formItems.value = initialFormItems
  }
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
onMounted(async () => {
  await loadData()
  console.log('User View mounted')
})
</script>
<template>
  <div>
    <h1>User View</h1>
    <CommonTable :columns :dataSource :loading />
    <a-modal v-model:open="value" :title @ok="handleOk">
      <FormModal ref="formRef" :formItems />
    </a-modal>
  </div>
</template>

<style scoped></style>
