<script lang="ts" setup>
import { isFunction } from '@/utils/common/checkUtils'
import { omit } from 'lodash-es'
import { computed, ref } from 'vue'
import type { Props } from './type'

defineOptions({
  name: 'CustomButton'
})
const props = withDefaults(defineProps<Props>(), {
  autoLoading: false, // 自动loading
  enableConfirm: false,
  popConfig: () => ({
    title: '提示',
    description: '确定删除吗？',
    okText: '确定',
    cancelText: '取消'
  })
})
const propsCache = computed(() => (props.enableConfirm ? omit(props, 'popConfig') : props))

const loadingStatus = ref(false)
const handleClick = async (e: Event) => {
  if (props.autoLoading) {
    loadingStatus.value = true
    return emitClick(e)
  }
  emitClick(e)
}
const emitClick = (e: Event) => {
  const res = props.onClick?.(e)
  if (isFunction(props.onClick) && props.autoLoading) {
    handlePromiseCallBack(res as Promise<void> | undefined)
  }
}
// 触发click事件和回调函数,回调后消失loading
const hideLoading = () => {
  loadingStatus.value = false
}
const handlePromiseCallBack = async (res: Promise<void> | undefined) => {
  try {
    if (res) {
      await res.finally(() => {
        hideLoading()
      })
    } else {
      hideLoading()
    }
  } catch (e) {
    hideLoading()
    console.error(e)
    // throw new Error('请传入一个Promise')
  }
}
</script>

<template>
  <template v-if="enableConfirm">
    <a-popconfirm v-bind="props.popConfig">
      <a-button v-bind="{ ...propsCache, loading: loadingStatus, onClick: handleClick }">
        <template #icon>
          <slot name="icon"></slot>
        </template>
        <template #default="data">
          <slot v-bind="data || {}"></slot>
        </template>
      </a-button>
    </a-popconfirm>
  </template>
  <template v-else>
    <a-button v-bind="{ ...propsCache, loading: loadingStatus, onClick: handleClick }">
      <template #icon>
        <slot name="icon"></slot>
      </template>
      <template #default="data">
        <slot v-bind="data || {}"></slot>
      </template>
    </a-button>
  </template>
</template>

<style scoped></style>
