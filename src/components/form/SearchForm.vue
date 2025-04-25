<script setup lang="ts">
import { useEmitOrDefault } from '@/hooks/useEmitOrDefault'

interface Field {
  name: string
  label: string
  component?: string
  props?: any
}
interface IProps {
  fields: Array<Field>
  defaultValues: Record<string, any>
}
function resetFormState() {
  Object.keys(defaultValues).forEach((key) => {
    formState[key] = structuredClone(defaultValues[key]) ?? ''
  })
}
const { fields, defaultValues } = defineProps<IProps>()

const emits = defineEmits<{
  (e: 'submit', formState: typeof defaultValues): void
  (e: 'reset'): void
}>()

// 表单状态管理
const formState = reactive({ ...defaultValues })
const { emitOrDefault: handleSubmit } = useEmitOrDefault(
  'submit',
  (payload) => emits('submit', payload),
  () => console.log('默认提交逻辑:', formState)
)

const { emitOrDefault: handleReset } = useEmitOrDefault('reset', () => emits('reset'), resetFormState)
// 监听默认值的变化以更新表单状态
watchEffect(() => {
  resetFormState()
})
</script>

<template>
  <div class="search-container">
    <a-form @submit.prevent="handleSubmit">
      <a-row :gutter="16">
        <!-- 动态生成表单字段 -->
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
