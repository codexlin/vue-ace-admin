<script lang="ts" setup>
import { computed, ref, useAttrs, useSlots } from 'vue'
import type { ProButtonProps } from './type'
import { isPromise } from 'radash'

const props = withDefaults(defineProps<ProButtonProps>(), {
  autoLoading: false,
  enableConfirm: false,
  popConfig: () => ({
    title: '提示',
    description: '确定删除吗？',
    okText: '确定',
    cancelText: '取消'
  })
})

defineOptions({
  inheritAttrs: false
})

const attrs = useAttrs()
const slots = useSlots()
const slotNames = Object.keys(slots) as string[]

const propsData = computed(() => {
  const {
    autoLoading: _autoLoading,
    enableConfirm: _enableConfirm,
    popConfig: _popConfig,
    onClick: _onClick,
    ...rest
  } = props
  return {
    ...rest,
    ...attrs,
    loading: rest.loading ?? attrs.loading ?? loadingStatus.value
  }
})

const loadingStatus = ref<boolean>(false)

function runClickHandlers(e: MouseEvent) {
  const handler = props.onClick
  if (!handler) return undefined
  if (Array.isArray(handler)) {
    let result: unknown
    handler.forEach((fn) => {
      result = fn?.(e)
    })
    return result
  }
  return handler?.(e)
}

const handleClick = async (e: MouseEvent) => {
  if (props.autoLoading) {
    loadingStatus.value = true
  }

  const res = runClickHandlers(e)

  if (props.autoLoading) {
    if (isPromise(res)) {
      await handlePromiseCallBack(res)
    } else {
      hideLoading()
    }
  }
}

// 触发click事件和回调函数,回调后消失loading
const hideLoading = (): void => {
  loadingStatus.value = false
}

const handlePromiseCallBack = async (res: Promise<unknown>) => {
  try {
    await res.finally(() => {
      hideLoading()
    })
  } catch (e: unknown) {
    hideLoading()
    console.error(e)
  }
}
</script>

<template>
  <template v-if="enableConfirm">
    <a-popconfirm v-bind="popConfig">
      <a-button v-bind="propsData" @click="handleClick">
        <template v-for="(slot, index) of slotNames" :key="index" #[slot]="data">
          <slot :name="slot" v-bind="data || {}" />
        </template>
      </a-button>
    </a-popconfirm>
  </template>
  <template v-else>
    <a-button v-bind="propsData" @click="handleClick">
      <template v-for="(slot, index) of slotNames" :key="index" #[slot]="data">
        <slot :name="slot" v-bind="data || {}" />
      </template>
    </a-button>
  </template>
</template>
