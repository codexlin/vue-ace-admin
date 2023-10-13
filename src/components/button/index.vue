<script lang="ts" setup>
import { ref } from 'vue'
import { isFunction } from '@/utils/checkUtils'
import type { Props } from './type'

defineOptions({
  name: 'CustomButton'
})
const props = withDefaults(defineProps<Props>(), {
  autoLoading: false // 自动loading
})
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
  <a-button v-bind="{ ...props, loading: loadingStatus, onClick: handleClick }">
    <slot></slot>
  </a-button>
</template>

<style scoped></style>
