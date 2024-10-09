<script setup lang="ts">
import { omit } from 'radash'
import { getDetail } from '../../api'
import useLocalI18n from '@/hooks/useLocalI18n'
import { buildTreeDataSelect } from '@/utils/common/treeUtil'

interface IItem {
  label: string
  name: string
  ui: string
  defaultValue?: string | number
  disabled?: boolean

  [key: string]: any
}
const formState = ref<Record<string, any>>({})
interface State {
  type: 'add' | 'edit' | 'detail' | 'delete'
  id: number | null
}
const { type = 'add', id = null } = defineProps<State>()
const { tt } = useLocalI18n()
const formItems = ref<IItem[]>([])
// 初始化ui组件相关属性
const initUi = (item: IItem) => {
  if (!formState.value[item.name] && item.defaultValue) {
    formState.value[item.name] = item.defaultValue
  }
  return omit(item, ['name', 'label', 'ui', 'defaultValue'])
}
const change = () => {
  console.log('formState:', formState.value)
}
const btnFormItems = ['name', 'title', 'parentId', 'menuType', 'hidden']
const detailFormItems = ref<IItem[]>([])
const initFormItems = async () => {
  const treeData = await buildTreeDataSelect()
  detailFormItems.value = [
    {
      ui: 'a-radio-group',
      name: 'menuType',
      label: '菜单类型',
      disabled: false,
      defaultValue: 'M',
      options: [
        { value: 'M', label: '目录' },
        { value: 'C', label: '菜单' },
        { value: 'B', label: '按钮' }
      ]
    },
    {
      ui: 'a-tree-select',
      name: 'parentId',
      label: '上级菜单',
      dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
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
      placeholder: '比如：/system'
    },
    {
      ui: 'a-input',
      name: 'title',
      label: '菜单名称',
      disabled: false,
      placeholder: '比如：router.xxx(对应国际化内容)'
    },
    {
      ui: 'a-input',
      name: 'name',
      label: '路由名称',
      disabled: false,
      placeholder: '比如：Dashboard'
    },
    {
      ui: 'a-input',
      name: 'component',
      label: '组件路径',
      disabled: false,
      placeholder: '比如：/system/menu/index'
    },
    { ui: 'a-input-number', name: 'orderNum', label: '排序', disabled: false, defaultValue: 0 },

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
  if (type === 'add' && id) {
    detailFormItems.value[1].defaultValue = id
  }
  if (['edit', 'detail'].includes(type)) {
    if (id) {
      const { data } = await getDetail<IItem>(id)
      formState.value = data || {}
    }
  }
  formItems.value = [...detailFormItems.value]
  console.log(formState.value)
}
onMounted(() => {
  initFormItems()
})
watch(
  () => formState.value.menuType,
  (val) => {
    if (val === 'B') {
      formItems.value = formItems.value.filter((item) => {
        if (btnFormItems.includes(item.name)) {
          if (item.name === 'name') {
            item.label = '按钮名称'
            item.placeholder = '比如:新增/新增用户'
          }
          if (item.name === 'title') {
            item.label = '按钮国际化'
            item.placeholder = '比如:common.add'
          }
          return true
        }
        return false
      })
      formItems.value.splice(-1, 0, {
        ui: 'a-input',
        name: 'permission',
        label: '按钮权限',
        placeholder: '比如:sys:user:add'
      })
    } else {
      formItems.value = [...detailFormItems.value]
      console.log(detailFormItems.value)
    }
  }
)
const getFormState = () => {
  const keys = Object.values(formItems.value.map((i) => i.name)).filter((i) => Object.keys(formState.value).includes(i))
  console.log(keys)
  // return omit(formState.value, keys)
}
defineExpose({
  formState
})
</script>
<template>
  <div>
    <a-form :model="formState">
      <template v-for="item in formItems" :key="item.name">
        <a-form-item :name="item.name" :label="item.label">
          <component :is="item.ui" v-model:value="formState[item.name]" v-bind="initUi(item)" @change="change" />
        </a-form-item>
      </template>
    </a-form>
  </div>
</template>
<style scoped></style>
