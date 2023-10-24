<script lang="tsx" setup>
import CommonTableVue from '@/components/table/CommonTable.vue'
import useList from '@/hooks/useList'
import { computed, onMounted } from 'vue'
import { getListWithPage } from '../api/index'

defineOptions({
  name: 'InventoryView'
})
type Props = {
  pageNum: number
  pageSize: number
}
const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: 'NickName',
    dataIndex: 'nickName',
    key: 'nickName',
    ellipsis: true
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
    ellipsis: true
  },
  {
    title: 'RoleName',
    dataIndex: 'roleName',
    key: 'roleName',
    ellipsis: true
  },
  {
    title: 'Long Column Long Column Long Column',
    dataIndex: 'address',
    key: 'address',
    ellipsis: true,
    customRender: ({ text }: any) => <a>{text}</a>
  },

  {
    title: 'CreateTime',
    dataIndex: 'createTime',
    key: 'createTime',
    ellipsis: true
  },
  {
    title: 'UpdateTime',
    dataIndex: 'updateTime',
    key: 'updateTime',
    ellipsis: true
  }
]
const { list, loadData, loading, pageSize, curPage, total } = useList({ listRequestFn: getListWithPage<Props> })
const pagination = computed(() => ({
  total: total.value,
  showTotal(total: Number) {
    return `Total  ${total} items`
  }
}))
const handleTableChange = (pagination: any, filters: any, sorter: any, { currentDataSource }: any) => {
  console.log(pagination, filters, sorter, currentDataSource)
  pageSize.value = pagination.pageSize
  curPage.value = pagination.current
}
onMounted(async () => {
  await loadData()
})
</script>
<template>
  <section>
    <h2>分页列表</h2>
    <div>
      <CommonTableVue
        :columns="columns"
        :data-source="list"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ text }">
          <a>
            {{ text }}
          </a>
        </template>
      </CommonTableVue>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
