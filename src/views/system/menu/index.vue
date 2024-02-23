<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import useList from '@/hooks/useList'
import { getMenuTreeList } from '@/views/system/api'

defineOptions({
  name: 'MenuManage'
})
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'parentId',
    dataIndex: 'parentId',
    key: 'parentId'
  },
  {
    title: 'orderNum',
    dataIndex: 'orderNum',
    key: 'orderNum'
  },
  {
    title: 'path',
    dataIndex: 'path',
    key: 'path'
  },
  {
    title: 'title',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: 'isFrame',
    dataIndex: 'isFrame',
    key: 'isFrame'
  },
  {
    title: 'isCache',
    dataIndex: 'isCache',
    key: 'isCache'
  },
  {
    title: 'menuType',
    dataIndex: 'menuType',
    key: 'menuType'
  },
  {
    title: 'hidden',
    dataIndex: 'hidden',
    key: 'hidden'
  },
  {
    title: 'permission',
    dataIndex: 'permission',
    key: 'permission'
  },
  {
    title: 'icon',
    dataIndex: 'icon',
    key: 'icon'
  },
  {
    title: 'component',
    dataIndex: 'component',
    key: 'component'
  }
]

const { list, loadData, loading, pageSize, curPage, total } = useList({ listRequestFn: getMenuTreeList })
onMounted(async () => await loadData())
const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys: (string | number)[], selectedRows: any[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record: any, selected: boolean, selectedRows: any[]) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected: boolean, selectedRows: any[], changeRows: any[]) => {
    console.log(selected, selectedRows, changeRows)
  }
})
</script>
<template>
  <div>
    <a-space align="center" style="margin-bottom: 16px">
      CheckStrictly:
      <a-switch v-model:checked="rowSelection.checkStrictly"></a-switch>
    </a-space>
    <a-card>
      <a-table
        :scroll="{ x: 2000 }"
        row-key="id"
        :loading="loading"
        :columns="columns"
        :data-source="list"
        :row-selection="rowSelection"
      />
    </a-card>
  </div>
</template>
<style lang="scss" scoped></style>
