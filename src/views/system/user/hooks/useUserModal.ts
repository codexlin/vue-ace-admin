import { useToggle } from '@vueuse/core'
import { getRoleList, getUserRoleInfo, updateUserRole, addRole, deleteRole } from '../../api'
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

//职责：管理弹窗开关 初始化表单项 控制新增/编辑行为

export default function useUserModal() {
  const [visible, toggle] = useToggle()
  const formRef = ref()
  const detailData = ref()
  const formItems: Ref<FormItem[]> = ref([])

  const clickType = ref<'add' | 'edit' | 'delete'>('add')
  const recordData = ref()

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

  const openModal = async (record: IUser, type: 'add' | 'edit' | 'delete') => {
    recordData.value = record
    clickType.value = type

    if (type === 'delete') {
      await deleteRole(record.id)
      toggle(false)
      return
    }

    if (type !== 'add') {
      const res = await getUserRoleInfo<Record<string, any>>(record.userId)
      detailData.value = {
        ...res.data,
        roleIds: res.data?.roles?.map((r: any) => r.roleId) || []
      }
    } else {
      detailData.value = null
    }

    await initFormItems()
    toggle(true)
  }

  const handleOk = async () => {
    const data = formRef.value?.formState
    const userId = recordData.value.userId
    const res = clickType.value === 'add' ? await addRole(data) : await updateUserRole({ ...data, userId })

    if (res.code === '0') {
      toggle(false)
    }
  }

  return {
    visible,
    title,
    formItems,
    formRef,
    handleOk,
    openModal
  }
}
