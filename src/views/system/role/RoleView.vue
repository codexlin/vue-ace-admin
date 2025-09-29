<script lang="tsx" setup>
import { ProTable } from '@ace-admin/ui'
import { useToggle } from '@vueuse/core'
import useRoleForm from './hooks/useRoleForm'
import useRoleList from './hooks/useRoleList.tsx'
import FormModal from '@/components/form/FormModal'
import useList from '@/hooks/useList'
import useLocalI18n from '@/hooks/useLocalI18n'

const [modalOpen, toggleModal] = useToggle()
const { tt } = useLocalI18n()
const { formRef, formItems, handleClick, handleOk } = useRoleForm()
const { dataSource, loadData, loading, columns } = useRoleList(handleClick)
async function onOk() {
  const res = await handleOk()
  if (res?.code === '0') toggleModal()
}
onMounted(() => {
  loadData()
})
</script>

<template>
  <div>
    <ProTable :table-props="{ rowKey: 'id', columns, dataSource, loading }">
      <template #toolbar>
        <a-space>
          <a-button type="primary" @click="() => handleClick(null, 'add').then(toggleModal)"> 新增 </a-button>
        </a-space>
      </template>
    </ProTable>
    <a-modal v-model:open="modalOpen" :destroy-on-close="true" title="角色设置" @ok="onOk">
      <FormModal ref="formRef" :form-items="formItems" />
    </a-modal>
  </div>
</template>
