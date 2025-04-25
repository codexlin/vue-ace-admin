<script lang="tsx" setup>
import { useToggle } from '@vueuse/core'
import type { TableColumnType } from 'ant-design-vue'
import { addRole, deleteRole, getRoleList, getUserList, getUserRoleInfo, updateUserRole } from '../api'
import { OperationButtons } from '@/components'
import FormModal, { type IFormModal } from '@/components/form/FormModal'
import useList from '@/hooks/useList'
import useLocalI18n from '@/hooks/useLocalI18n'
/** 表单项类型 */
type FormItem = {
  ui: string
  name: string
  label: string
  allowClear?: boolean
  placeholder?: string
  defaultValue?: any
  mode?: 'multiple'
  options?: { value: number; label: string }[]
}

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

const formRef = ref<IFormModal>()
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
// -- 弹窗表单项 --
const formItems: Ref<FormItem[]> = ref([])

const clickType = ref('add')
// -- 根据操作类型初始化数据 --
const initWithClickType = async (record: IUser) => {
  if (clickType.value === 'delete') {
    await deleteRole(record.id)
    await loadData()
    return
  }
  if (clickType.value !== 'add') {
    const res = await getUserRoleInfo<Record<string, any>>(record.userId)
    detailData.value = {
      ...res.data,
      roleIds: res.data?.roles?.map((i: Record<string, any>) => i.roleId) || []
    }
  } else {
    detailData.value = null
  }
  await initFormItems()
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
// -- 初始化表单项 --
const initFormItems = async () => {
  const res = await getRoleList<any[]>()
  const options = res.data?.map((i) => ({ value: i.roleId, label: i.roleName })) || []
  const base: FormItem[] = [
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
  if (detailData.value?.roleIds) {
    formItems.value = base.map((item) => ({
      ...item,
      defaultValue: detailData.value?.[item.name] ?? item.defaultValue
    }))
  } else {
    formItems.value = base
  }
}

const { dataSource, loadData, loading } = useList({ listRequestFn: getUserList })
const columns: TableColumnType<IUser>[] = [
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
interface FieldItem {
  name: string
  label: string
  component: string
  props?: Record<string, any>
}
const fields = reactive<FieldItem[]>([
  { name: 'name', label: '姓名', component: 'a-input', props: { placeholder: '请输入姓名' } },
  { name: 'age', label: '年龄', component: 'a-input-number', props: { placeholder: '请输入年龄' } },
  {
    name: 'gender',
    label: '性别',
    component: 'a-select',
    props: {
      options: [
        { value: 'male', label: '男' },
        { value: 'female', label: '女' }
      ]
    }
  }
])

const defaultValues = {
  name: '默认姓名',
  age: 25,
  gender: 'male'
}
interface SearchFormState {
  name?: string
  age?: number
  gender?: string
}
const handleSearch = (formState: SearchFormState) => {
  console.log('搜索条件:', formState)
  // 执行检索操作
}

const handleReset = () => {
  console.log('表单已重置')
  // 执行重置操作
}
onMounted(async () => {
  await loadData()
  console.log('User View mounted')
})
</script>
<template>
  <div>
    <h1>User View</h1>
    <SearchForm :fields :defaultValues @submit="handleSearch" @reset="handleReset" />
    <CommonTable :table-props="{ columns, dataSource, loading }" />
    <a-modal v-model:open="value" :destroy-on-close="true" :title @ok="handleOk">
      <FormModal ref="formRef" :formItems />
    </a-modal>
  </div>
</template>

<style scoped></style>
