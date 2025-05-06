import { ref } from 'vue'
import { addRole, deleteRole, getRoleDetail, updateRole } from '../../api'
import useTreePathMap from './useTreePathMap'
import { buildTreeDataSelect } from '@/utils/common/treeUtil'
import { type IFormModal } from '@/components/form/FormModal'

export default function useRoleForm() {
  const formRef = ref<IFormModal | null>(null)
  const clickType = ref<'add' | 'edit' | 'detail' | 'delete'>('add')
  const detailData = ref<any>({})
  const formItems = ref<any[]>([])

  const { loops, getPath, filterDeepestNodes } = useTreePathMap()

  async function initFormItems() {
    const treeData = await buildTreeDataSelect()
    loops(treeData)

    const baseItems = [
      {
        ui: 'a-input',
        name: 'roleName',
        label: '角色名称',
        placeholder: '请输入角色名'
      },
      {
        ui: 'a-tree-select',
        name: 'menuIds',
        label: '菜单权限',
        allowClear: true,
        treeCheckable: true,
        placeholder: '请设置角色的菜单权限',
        treeData
      },
      {
        ui: 'a-radio-group',
        name: 'status',
        label: '是否启用',
        defaultValue: '0',
        options: [
          { value: '0', label: '是' },
          { value: '1', label: '否' }
        ]
      }
    ]

    formItems.value = baseItems.map((item) => ({
      ...item,
      defaultValue: detailData.value?.[item.name] ?? item.defaultValue
    }))
  }

  async function handleClick(record: any, type: typeof clickType.value) {
    clickType.value = type
    if (type === 'delete') {
      return await deleteRole(record?.roleId)
    }

    if (type !== 'add') {
      const res = await getRoleDetail<any>(record?.roleId)
      const menuIds = filterDeepestNodes(res.data?.menus.map((i: any) => i.id) || [])
      detailData.value = { ...res.data.role, menuIds }
    } else {
      detailData.value = {}
    }

    await initFormItems()
  }

  async function handleOk() {
    const data = formRef.value?.formState || {}
    data.menuIds = [...new Set(data.menuIds.flatMap((id: number) => getPath(id)))]
    const res =
      clickType.value === 'add' ? await addRole(data) : await updateRole({ ...data, roleId: detailData.value?.roleId })
    return res
  }

  return {
    formRef,
    formItems,
    clickType,
    handleClick,
    handleOk
  }
}
