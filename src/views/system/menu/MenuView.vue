<script lang="tsx" setup>
import { onMounted, ref } from 'vue'
import DetailView from './components/DetailView.vue'
import { useConfig } from './hooks/useConfig'
import useList from '@/hooks/useList'
import useLocalI18n from '@/hooks/useLocalI18n'
import { useUserStore } from '@/stores/modules/user'
import { showModalConfirm } from '@/utils/common'
import { addMenu, deleteMenu, getMenuTreeList, updateMenu } from '@/views/system/api'

const { tt } = useLocalI18n()
const title = shallowRef('')
interface State {
  type: 'add' | 'edit' | 'detail' | 'delete'
  id: number | null
}
const state = shallowReactive<State>({
  type: 'add',
  id: null
})
const formRef = ref<InstanceType<typeof DetailView>>()
const { dataSource, loadData, loading } = useList({ listRequestFn: getMenuTreeList })

const handleClick = (record?: any, btnType?: State['type']) => {
  if (btnType) {
    state.type = btnType
    const isAdd = btnType === 'add'
    const isDelete = btnType === 'delete'
    title.value = isAdd ? tt('common.add') : tt('common.edit')
    state.id = record?.id ? record.id : null
    if (isDelete) {
      const onOk = async () => {
        await deleteMenu(record.id)
        await loadData()
      }
      return showModalConfirm({
        title: '确认删除吗?',
        onOk
      })
    }
  }
  toggleOpen()
}

const { columns, open, toggleOpen } = useConfig(handleClick)

const handleOk = async () => {
  const data = formRef.value?.formState
  if (data) {
    if (state.type !== 'add') {
      return handleRequest(() => updateMenu(data))
    }
    await handleRequest(() => addMenu(data))
    toggleOpen()
  }
}

const handleRequest = async (cb: (...args: any[]) => any) => {
  try {
    await cb()
    showModalConfirm({
      title: '是否重新登录?',
      content: '您修改了菜单相关设置,需要重新登录后才生效',
      onOk() {
        useUserStore().logout()
      },
      onCancel: async () => {
        await loadData()
        toggleOpen()
      }
    })
  } catch (e) {
    console.log(e)
  }
}
onMounted(async () => await loadData())
</script>
<template>
  <div>
    <CommonTable
      :tableProps="{
        columns,
        dataSource,
        loading,
        rowKey: 'id',
        scroll: { x: 2000 }
      }"
      isZebra="even"
      useCardWrapper
      class="scroll-table"
    >
      <template #toolbar>
        <a-space>
          <a-button type="primary" @click="handleClick(null, 'add')">
            {{ tt('common.add') }}
          </a-button>
        </a-space>
      </template>
    </CommonTable>
    <a-modal v-model:open="open" :title destroy-on-close @ok="handleOk">
      <DetailView ref="formRef" v-bind="state" />
    </a-modal>
  </div>
</template>
