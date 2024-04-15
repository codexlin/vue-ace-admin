<script lang="tsx" setup>
import FormModal, { type IFormModal } from '@/components/form/FormModal'
import { OperationButtons, SvgIcon } from '@/components'
import useList from '@/hooks/useList'
import useLocalI18n from '@/hooks/useLocalI18n'
import { useUserStore } from '@/stores/modules/user'
import { showModalConfirm } from '@/utils/common'
import { buildTreeDataSelect } from '@/utils/common/treeUtil'
import { addMenu, deleteMenu, getDetail, getMenuTreeList, updateMenu } from '@/views/system/api'
import type { ColumnsType } from 'ant-design-vue/es/table/Table'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'MenuManage'
})

interface IItem {
  label: string
  name: string
  ui: string
  defaultValue?: string | number
  disabled?: boolean

  [key: string]: any
}

const { tt } = useLocalI18n()
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    hidden: true
  },
  {
    title: '菜单名称',
    dataIndex: 'title',
    key: 'title',
    customRender: ({ text }: any) => {
      return <span>{tt(text)}</span>
    }
  },
  {
    title: '路由名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '路由路径',
    dataIndex: 'path',
    key: 'path'
  },
  {
    title: 'isFrame',
    dataIndex: 'isFrame',
    key: 'isFrame',
    customRender: ({ text }: any) => {
      return <span>{text === '0' ? tt('common.yes') : tt('common.no')}</span>
    }
  },
  {
    title: 'isCache',
    dataIndex: 'isCache',
    key: 'isCache',
    customRender: ({ text }: any) => {
      return <span>{text === '0' ? tt('common.yes') : tt('common.no')}</span>
    }
  },
  {
    title: '类型',
    dataIndex: 'menuType',
    key: 'menuType',
    customRender: ({ text }: any) => {
      return <a-tag color="#87d068">{text}</a-tag>
    }
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
    key: 'permission'
  },
  {
    title: '菜单图标',
    dataIndex: 'icon',
    key: 'icon',
    customRender: ({ record }: any) => {
      return <SvgIcon name={record.icon} />
    }
  },
  {
    title: '组件路径',
    dataIndex: 'component',
    key: 'component'
  },
  {
    title: '排序',
    dataIndex: 'orderNum',
    key: 'orderNum'
  },
  {
    title: tt('common.operation'),
    dataIndex: 'operation',
    key: 'operation',
    width: '10%',
    fixed: 'right',
    customRender: ({ record }) => {
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
const open = ref(false)
const formItems = shallowRef<IItem[]>([])
const initFormItems = async () => {
  const treeData = await buildTreeDataSelect(tt)
  formItems.value = [
    {
      ui: 'a-tree-select',
      name: 'parentId',
      label: '上级菜单',
      allowClear: true,
      placeholder: '请选择上级菜单,不选默认为根节点',
      treeData
    },
    {
      ui: 'a-select',
      name: 'icon',
      label: '菜单图标',
      disabled: false,
      allowClear: true,
      options: [{ value: 1, label: 1 }]
    },
    {
      ui: 'a-input',
      name: 'path',
      label: '菜单路径',
      disabled: false,
      placeholder: '路由中的path值如:/xxx'
    },
    {
      ui: 'a-input',
      name: 'title',
      label: '菜单名称',
      disabled: false,
      placeholder: '格式:router.xxx'
    },
    {
      ui: 'a-input',
      name: 'name',
      label: '路由名称',
      disabled: false,
      placeholder: '路由中的name值'
    },
    {
      ui: 'a-input',
      name: 'component',
      label: '组件路径',
      disabled: false,
      placeholder: '组件路径'
    },
    { ui: 'a-input-number', name: 'orderNum', label: '排序', disabled: false, defaultValue: 0 },
    {
      ui: 'a-radio-group',
      name: 'menuType',
      label: '菜单类型',
      disabled: false,
      defaultValue: 'M',
      options: [
        { value: 'M', label: '目录' },
        { value: 'C', label: '菜单' },
        { value: 'F', label: '按钮' }
      ]
    },
    {
      ui: 'a-radio-group',
      name: 'isFrame',
      label: '是否外链',
      defaultValue: '0',
      disabled: false,
      options: [
        { value: '0', label: '是' },
        { value: '1', label: '否' }
      ]
    },
    {
      ui: 'a-radio-group',
      name: 'isCache',
      label: '是否缓存',
      disabled: false,
      defaultValue: '0',
      options: [
        { value: '0', label: '是' },
        { value: '1', label: '否' }
      ]
    },
    {
      ui: 'a-radio-group',
      name: 'hidden',
      label: '是否隐藏',
      disabled: false,
      defaultValue: '1',
      options: [
        { value: '0', label: '是' },
        { value: '1', label: '否' }
      ]
    }
  ]
}
const title = shallowRef('')
type modelType = 'add' | 'edit' | 'delete'
const type = shallowRef<modelType>('add')
const detailData = shallowRef()
const toggle = (needRefresh?: boolean) => {
  needRefresh && loadData()
  open.value = !open.value
}
const handleClick = async (record?: any, btnType?: modelType) => {
  if (btnType) {
    const isAdd = btnType === 'add'
    const isDelete = btnType === 'delete'
    title.value = isAdd ? tt('common.add') : tt('common.edit')
    type.value = btnType
    await initFormItems()
    if (record && record.id && isAdd) {
      formItems.value[0].defaultValue = record.id
    }
    if (['edit', 'detail'].includes(btnType)) {
      const { data } = await getDetail<IItem>(record.id)
      detailData.value = data
      console.log('data', data)
      formItems.value.forEach((i: IItem) => {
        const hasData = data?.[i.name]
        if (hasData) {
          i.defaultValue = hasData
        }
      })
    }
    // 可加modal确认
    if (isDelete) {
      const onOk = async () => {
        await deleteMenu(record.id)
        await loadData()
      }
      return showModalConfirm({
        title: '确认删除吗?',
        onOk
      })
    }
  }
  toggle()
}
const formRef = ref<IFormModal | null>(null)
const handleRequest = async (cb: (...args: any[]) => any) => {
  try {
    await cb()
    showModalConfirm({
      title: '是否重新登录?',
      content: '您修改了菜单相关设置,需要重新登录后才生效',
      onOk() {
        useUserStore().logout()
      },
      onCancel: () => toggle(true)
    })
  } catch (e) {
    console.log(e)
  }
}

const handleOk = async () => {
  const data = formRef.value?.formState || null
  if (data) {
    if (type.value !== 'add') {
      data.id = detailData.value.id
      return handleRequest(() => updateMenu(data))
    }
    await handleRequest(() => addMenu(data))
    toggle()
  }
}
const { dataSource, loadData, loading } = useList({ listRequestFn: getMenuTreeList })
onMounted(async () => await loadData())
</script>
<template>
  <div>
    <a-card>
      <a-table :columns :dataSource :loading :scroll="{ x: 2000 }" class="scroll-table" row-key="id" />
    </a-card>
    <a-modal v-model:open="open" :title destroy-on-close @ok="handleOk">
      <FormModal ref="formRef" :formItems />
    </a-modal>
  </div>
</template>
