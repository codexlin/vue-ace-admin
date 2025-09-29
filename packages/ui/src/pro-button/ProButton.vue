<script lang="ts" setup>
import { computed, ref, useAttrs, useSlots } from 'vue'
import type { Props } from './type'
import { isPromise } from './type'

const props = withDefaults(defineProps<Props>(), {
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

const propsData = computed(() => ({
  ...attrs,
  loading: attrs.loading || loadingStatus.value
}))

const loadingStatus = ref<boolean>(false)

const handleClick = async (e: MouseEvent) => {
  if (props.autoLoading) {
    loadingStatus.value = true
  }

  const res = props.onClick?.(e)

  if (props.autoLoading) {
    if (isPromise(res)) {
      handlePromiseCallBack(res)
    } else {
      hideLoading()
    }
  }
}

// 触发click事件和回调函数,回调后消失loading
const hideLoading = (): void => {
  loadingStatus.value = false
}

const handlePromiseCallBack = async (res: Promise<any>) => {
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
