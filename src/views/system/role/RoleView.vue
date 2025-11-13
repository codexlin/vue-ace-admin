<script lang="tsx" setup>
import { ProTable } from '@ace-admin/ui'
import { useToggle } from '@vueuse/core'
import useRoleForm from './hooks/useRoleForm'
import useRoleList from './hooks/useRoleList.tsx'
import FormModal from '@/components/form/FormModal'
import useLocalI18n from '@/hooks/useLocalI18n'

const [modalOpen, toggleModal] = useToggle()
const { tt } = useLocalI18n()
const { formRef, formItems, handleClick, handleOk } = useRoleForm()
const { dataSource, loadData, loading, columns } = useRoleList(handleClick)

// 处理新增按钮点击
const handleAdd = async () => {
  try {
    await handleClick(null, 'add')
    toggleModal()
  } catch (error) {
    console.error('初始化表单失败:', error)
  }
}

async function onOk() {
  const res = await handleOk()
  if (res?.code === '0') {
    toggleModal()
    await loadData() // 保存成功后刷新列表
  }
}
// 使用 extra.immediate: true 自动加载，无需 onMounted
</script>

<template>
  <div>
    <ProTable row-key="id" :columns="columns" :dataSource="dataSource" :loading="loading">
      <template #toolbar>
        <a-space>
          <a-button type="primary" @click="handleAdd"> 新增 </a-button>
        </a-space>
      </template>
    </ProTable>
    <a-modal v-model:open="modalOpen" :destroy-on-close="true" title="角色设置" @ok="onOk">
      <FormModal ref="formRef" :form-items="formItems" />
    </a-modal>
  </div>
</template>
