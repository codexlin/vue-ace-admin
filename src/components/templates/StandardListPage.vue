<template>
  <div class="standard-list-page">
    <!-- 页面头部 -->
    <div v-if="title" class="page-header">
      <div class="header-content">
        <h2 class="page-title">{{ title }}</h2>
        <div class="header-actions">
          <a-space>
            <ProButton
              v-for="action in toolbarActions"
              :key="action.key || action.label"
              :type="action.type"
              :danger="action.type === 'danger'"
              :loading="action.loading"
              :auto-loading="!action.loading"
              @click="() => handleToolbarAction(action)"
            >
              <template v-if="action.icon" #icon>
                <component :is="action.icon" />
              </template>
              {{ action.label }}
            </ProButton>
          </a-space>
        </div>
      </div>
    </div>

    <!-- 搜索表单 -->
    <ProSearchForm
      v-if="showSearch && searchFields.length > 0"
      v-model="searchForm"
      :fields="searchFields"
      class="search-section"
      @submit="handleSearch"
      @reset="handleReset"
    />

    <!-- 数据表格 -->
    <ProTable
      :columns="tableColumns"
      :data-source="dataSource"
      :loading="loading"
      :is-zebra="isZebra"
      row-key="id"
      :pagination="paginationConfig"
      class="table-section"
      @change="handleChange"
    >
      <!-- 工具栏插槽 -->
      <template #toolbar>
        <slot name="toolbar">
          <a-space>
            <ProButton
              v-for="action in toolbarActions"
              :key="action.key || action.label"
              type="primary"
              :auto-loading="true"
              @click="() => handleToolbarAction(action)"
            >
              {{ action.label }}
            </ProButton>
          </a-space>
        </slot>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts">
import { ProTable, ProSearchForm } from '@codexlin/ace-admin-ui'
import type { ListPageConfig } from '@/types/template'
import { useStandardListPage } from '@/composables/useStandardListPage'

interface Props {
  /** API函数 */
  api: (params: any) => Promise<any>
  /** 页面标题 */
  title?: string
  /** 搜索字段配置 */
  searchFields?: any[]
  /** 表格列配置 */
  tableColumns?: any[]
  /** 工具栏按钮配置 */
  toolbarActions?: any[]
  /** 行操作按钮配置 */
  rowActions?: any[]
  /** 是否显示搜索区域 */
  showSearch?: boolean
  /** 斑马纹设置 */
  isZebra?: 'odd' | 'even' | 'none'
  /** 是否立即加载 */
  immediate?: boolean
  /** 防抖时间 */
  debounce?: number
  /** 分页配置 */
  pagination?: any
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  searchFields: () => [],
  tableColumns: () => [],
  toolbarActions: () => [],
  rowActions: () => [],
  showSearch: true,
  isZebra: 'even',
  immediate: true,
  debounce: 500,
  pagination: () => ({})
})

const emit = defineEmits<{
  success: []
  action: [type: string, record?: any]
}>()

// 使用标准列表页Hook
const {
  searchForm,
  dataSource,
  loading,
  total,
  curPage,
  pageSize,
  tableColumns,
  loadData,
  handleSearch,
  handleReset,
  handleToolbarAction
} = useStandardListPage({
  api: props.api,
  searchFields: props.searchFields,
  tableColumns: props.tableColumns,
  immediate: props.immediate,
  debounce: props.debounce
})

// 分页配置
const paginationConfig = computed(() => ({
  current: curPage.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
  ...props.pagination
}))

// 表格变化处理
const handleChange = (pagination: any, filters: any, sorter: any) => {
  curPage.value = pagination.current
  pageSize.value = pagination.pageSize
}

// 暴露给父组件的方法
defineExpose({
  refresh: loadData,
  getData: () => ({
    searchForm: searchForm.value,
    dataSource: dataSource.value,
    loading: loading.value,
    total: total.value
  })
})
</script>

<style scoped>
.standard-list-page .page-header {
  margin-bottom: 16px;
  padding: 16px 0;
}

.standard-list-page .header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.standard-list-page .page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.standard-list-page .header-actions {
  flex-shrink: 0;
}

.standard-list-page .search-section {
  margin-bottom: 16px;
}

.standard-list-page .table-section {
  background: white;
  border-radius: 6px;
}
</style>
