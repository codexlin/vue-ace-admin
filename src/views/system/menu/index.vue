<script lang="tsx" setup>
import useList from '@/hooks/useList'
import useLocalI18n from '@/hooks/useLocalI18n'
import { useUserStore } from '@/stores/modules/user'
import { showModalConfirm } from '@/utils/common'
import { addMenu, deleteMenu, getMenuTreeList, updateMenu } from '@/views/system/api'
import { onMounted, ref } from 'vue'
import DetailView from './components/DetailView.vue'
import { useConfig } from './hooks/useConfig'

defineOptions({
  name: 'MenuManage'
})

const { tt } = useLocalI18n()
const title = shallowRef('')
interface State {
  type: 'add' | 'edit' | 'detail' | 'delete'
  id: number | null
}
const state = reactive<State>({
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
    if (record && record.id) {
      state.id = record.id
    }
    // 可加modal确认
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
    <a-card>
      <a-table :columns :dataSource :loading :scroll="{ x: 2000 }" class="scroll-table" row-key="id" />
    </a-card>
    <a-modal v-model:open="open" :title destroy-on-close @ok="handleOk">
      <DetailView ref="formRef" v-bind="state" />
    </a-modal>
  </div>
</template>
