<script lang="tsx" setup>
import OperationButtons from '@/components/button/OperationButtons.vue'
import FormModal from '@/components/form/FormModal'
import SvgIcon from '@/components/svgIcon/index.vue'
import useList from '@/hooks/useList'
import useLocalI18n from '@/hooks/useLocalI18n'
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
      return <span>{text === 0 ? tt('common.yes') : tt('common.no')}</span>
    }
  },
  {
    title: 'isCache',
    dataIndex: 'isCache',
    key: 'isCache',
    customRender: ({ text }: any) => {
      return <span>{text === 0 ? tt('common.yes') : tt('common.no')}</span>
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
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: '10%',
    fixed: 'right',
    customRender: ({ record }: any) => {
      const items = [
        {
          auth: 'add',
          text: '新增',
          type: 'primary',
          cb: () => {
            handleClick(record, 'add')
          }
        },
        {
          auth: 'edit',
          text: '编辑',
          type: 'primary',
          cb: () => {
            handleClick(record, 'edit')
          }
        },
        {
          auth: 'delete',
          text: '删除',
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
const toggle = () => (open.value = !open.value)
const handleClick = async (record?: any, btnType?: modelType) => {
  if (btnType) {
    title.value = btnType === 'add' ? tt('common.add') : tt('common.edit')
    type.value = btnType
    await initFormItems()
    if (record && record.id) {
      formItems.value[0].defaultValue = record.id
    }
    if (['edit', 'detail'].includes(btnType)) {
      const data = (await getDetail(record.id)) as Record<string, any>
      detailData.value = data
      console.log('data', data)
      formItems.value.forEach((i: IItem) => {
        const hasData = data[i.name]
        if (hasData) {
          i.defaultValue = hasData
        }
      })
    }
    // 可加modal确认
    if (btnType === 'delete') return await deleteMenu(record.id)
  }
  toggle()
}
const formRef = ref<any>(null)
const handleOk = async () => {
  const data = formRef.value?.formState || null
  if (type.value !== 'add') {
    data.id = detailData.value.id
    return await updateMenu(data)
  }
  await addMenu(data)
  toggle()
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
