<script setup lang="ts">
import { getRoleList } from '../api'
import FormModal, { type IFormModal } from '@/components/form/FormModal'
import { buildTreeDataSelect } from '@/utils/common/treeUtil'
import useLocalI18n from '@/hooks/useLocalI18n'
import { ref } from 'vue'

const { tt } = useLocalI18n()
const open = ref(false)
const formRef = ref<IFormModal | null>(null)
const title = ref('新增角色')
const handleOk = async () => {
  const res = await formRef.value?.submit()
  console.log('handleOk', res)
}
const formItems = ref()
const handleClick = async () => {
  open.value = true
  await initFormItems()
}
const initFormItems = async () => {
  const treeData = await buildTreeDataSelect(tt)
  formItems.value = [
    {
      ui: 'a-input',
      name: 'roleName',
      label: '角色名称',
      disabled: false,
      placeholder: '请输入角色名'
    },
    {
      ui: 'a-tree-select',
      name: 'menuId',
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
}
onMounted(async () => {
  const res = await getRoleList()
  console.log('Role View mounted', res)
})
</script>
<template>
  <div>
    <h1>Role View</h1>
    <a-card>
      <CommonTable>
        <template #toolbar>
          <a-space>
            <a-button type="primary" @click="handleClick">新增</a-button>
          </a-space>
        </template>
      </CommonTable>
    </a-card>
    <a-modal v-model:open="open" :title destroy-on-close @ok="handleOk">
      <FormModal :formItems ref="formRef" />
    </a-modal>
  </div>
</template>
<style scoped></style>
