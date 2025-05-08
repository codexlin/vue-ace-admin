<script setup lang="ts">
import { reactive, computed, watchEffect } from 'vue'

interface Field {
  name: string
  label: string
  component?: string
  props?: Record<string, any>
}

interface IProps {
  fields: Field[]
  defaultValues?: Record<string, any>
  modelValue?: Record<string, any>
}

const props = defineProps<IProps>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: Record<string, any>): void
  (e: 'submit', val: Record<string, any>): void
  (e: 'reset'): void
}>()

// 本地状态（当没有 v-model 控制时使用）
const internalFormState = reactive({ ...structuredClone(props.defaultValues) })

// 统一的 formState 绑定（自动根据是否传入 modelValue 决定使用哪一个）
const formState = computed({
  get: () => props.modelValue ?? internalFormState,
  set: (val) => {
    if (props.modelValue) emit('update:modelValue', val)
    else Object.assign(internalFormState, val)
  }
})

// 提交事件
const handleSubmit = () => {
  emit('submit', formState.value)
}

// 重置事件
const handleReset = () => {
  const resetData: Record<string, any> = structuredClone(props.defaultValues)
  formState.value = resetData
  emit('reset')
}

// 监听 defaultValues 变化时重新初始化
// watchEffect(() => {
//   const resetData: Record<string, any> = structuredClone(props.defaultValues)
//   formState.value = resetData
// })
</script>

<template>
  <div class="search-container">
    <a-form :model="formState" @submit.prevent="handleSubmit">
      <a-row :gutter="16">
        <a-col v-for="field in fields" :key="field.name" :span="8">
          <a-form-item :label="field.label">
            <component :is="field.component || 'a-input'" v-model:value="formState[field.name]" v-bind="field.props" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" style="text-align: right">
          <a-button type="primary" @click="handleSubmit"> 搜索 </a-button>
          <a-button style="margin-left: 8px" @click="handleReset"> 重置 </a-button>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<style scoped lang="scss">
.search-container {
  padding: 10px;

  .ant-input-number {
    width: 100%;
  }
}
</style>
