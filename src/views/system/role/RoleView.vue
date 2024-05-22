<script lang="tsx" setup>
import { ref } from 'vue'
import { useToggle } from '@vueuse/core'
import type { ColumnsType } from 'ant-design-vue/es/table'
import { addRole, deleteRole, getRoleDetail, getRoleList, updateRole } from '../api'
import FormModal, { type IFormModal } from '@/components/form/FormModal'
import { buildTreeDataSelect } from '@/utils/common/treeUtil'
import useLocalI18n from '@/hooks/useLocalI18n'
import useList from '@/hooks/useList'
import { OperationButtons } from '@/components'

interface State {
  type: 'add' | 'edit' | 'detail' | 'delete'
  id: number | null
}

const [value, toggle] = useToggle()
const { tt } = useLocalI18n()
const formRef = ref<IFormModal | null>(null)
const title = ref('新增角色')
const valueMap = {}
const detailData = ref()

function loops(list: [], parent?: any) {
  return (list || []).map(({ children, value }) => {
    const node = (valueMap[value] = {
      parent,
      value
    })
    node.children = loops(children, node)
    return node
  })
}

function getPath(value: number) {
  const path = []
  let current = valueMap[value]
  while (current) {
    path.unshift(current.value)
    current = current.parent
  }
  return path
}

async function handleOk() {
  const data = formRef.value?.formState
  console.log(valueMap)
  const path: number[] = []
  data.menuIds = [...new Set(data?.menuIds?.flatMap((i: number) => getPath(i)))]
  console.log('menuIds', data.menuIds)
  const res = clickType.value === 'add' ? await addRole(data) : await updateRole({
    ...data,
    roleId: detailData.value.roleId
  })
  if (res.code === '0') {
    toggle()
  }

  console.log('handleOk', res)
}

const formItems = ref()
const clickType = ref('add')

async function handleClick(record = null, type: State['type']) {
  console.log(record)
  if (type === 'delete') return await deleteRole(record?.roleId)
  if (type !== 'add') {
    const res = await getRoleDetail(record?.roleId)
    detailData.value = { ...res.data.role, menuIds: res.data?.menus.map(i => i.id.toString()) }
  }
  clickType.value = type
  toggle()
  await initFormItems()
}

async function initFormItems() {
  const treeData = await buildTreeDataSelect()
  loops(treeData)
  // 定义初始表单项
  const initialFormItems = [
    {
      ui: 'a-input',
      name: 'roleName',
      label: '角色名称',
      disabled: false,
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
      disabled: false,
      options: [
        { value: '0', label: '是' },
        { value: '1', label: '否' }
      ]
    }
  ]

  // 更新表单项默认值，如果有详细数据存在
  if (detailData.value) {
    formItems.value = initialFormItems.map((item) => ({
      ...item,
      defaultValue: detailData.value[item.name] ?? item.defaultValue
    }))
    console.log('edit', formItems.value)
  } else {
    formItems.value = initialFormItems
  }
}

const columns = [
  {
    title: '角色ID',
    dataIndex: 'id'
  },
  {
    title: '角色名称',
    dataIndex: 'roleName'
  },
  {
    title: '角色状态',
    dataIndex: 'status'
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
] as ColumnsType<any>
const { dataSource, loadData, loading } = useList({ listRequestFn: getRoleList })

onMounted(async () => {
  await loadData()
})
</script>

<template>
  <div>
    <h1>Role View</h1>
    <a-card>
      <CommonTable :columns :data-source="dataSource" :loading>
        <template #toolbar>
          <a-space>
            <a-button type="primary" @click="handleClick(null, 'add')"> 新增</a-button>
          </a-space>
        </template>
      </CommonTable>
    </a-card>
    <a-modal v-model:open="value" :destroy-on-close="true" :title @ok="handleOk">
      <FormModal ref="formRef" :form-items="formItems" />
    </a-modal>
  </div>
</template>

<style scoped></style>
