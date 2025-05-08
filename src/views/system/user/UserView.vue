<script setup lang="tsx">
import useUserList from './hooks/useUserList'
import useUserModal from './hooks/useUserModal'
import useUserSearchForm from './hooks/useUserSearchForm'
import FormModal from '@/components/form/FormModal'

const { visible, title, formItems, formRef, handleOk, openModal } = useUserModal()

const { columns, dataSource, loadData, loading } = useUserList(openModal)

const { fields, state, handleSearch, handleReset } = useUserSearchForm(
  (formState) => {
    // 你可以在这里调用 API 或 filter 数据
    console.log('实际发起查询:', formState)
  },
  () => {
    // 重置后可能要重新加载数据
    console.log('重置回调触发')
    loadData()
  }
)

onMounted(loadData)
</script>

<template>
  <div>
    <h1>User View</h1>
    <SearchForm v-model:modelValue="state" :fields @submit="handleSearch" @reset="handleReset" />
    <CommonTable :table-props="{ columns, dataSource, loading }" />
    <a-modal v-model:open="visible" :title="title" :destroy-on-close="true" @ok="handleOk">
      <FormModal ref="formRef" :form-items="formItems" />
    </a-modal>
  </div>
</template>
