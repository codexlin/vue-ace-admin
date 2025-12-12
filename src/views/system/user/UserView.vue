<script setup lang="ts">
import { ProTable } from '@codexlin/ace-admin-ui'

import useUserList from './hooks/useUserList'
import useUserModal from './hooks/useUserModal'
import useUserSearchForm from './hooks/useUserSearchForm'

import FormModal from '@/components/form/FormModal'

const { visible, title, formItems, formRef, handleOk, openModal } = useUserModal()

const { fields, state, handleSearch, handleReset } = useUserSearchForm(
  (formState) => {
    console.log('实际发起查询:', formState)
    // 由于 filters.autoWatch 已开启，会自动刷新，这里可以手动触发确保立即响应
    void loadData(1, formState)
  },
  () => {
    console.log('重置回调触发')
    // 重置后自动刷新会触发，这里手动触发确保立即响应
    void loadData(1, state.value)
  }
)

const { columns, dataSource, loadData, loading } = useUserList(openModal, state)

// 使用 extra.immediate: true 自动加载，无需 onMounted
</script>

<template>
  <div>
    <h1>User View</h1>
    <SearchForm v-model:modelValue="state" :fields="fields" @submit="handleSearch" @reset="handleReset" />
    <ProTable is-zebra="even" :columns="columns" :dataSource="dataSource" :loading="loading" row-key="id" />
    <a-modal v-model:open="visible" :title="title" :destroy-on-close="true" @ok="handleOk">
      <FormModal ref="formRef" :form-items="formItems" />
    </a-modal>
  </div>
</template>
