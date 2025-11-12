<script setup lang="ts">
import type { ProSearchFormProps, ProSearchFormEmits } from './type'

const props = withDefaults(defineProps<ProSearchFormProps>(), {
  fields: () => []
})

const models = defineModel<{
  modelValue: Record<string, unknown>
}>()

const emit = defineEmits<ProSearchFormEmits>()

// actions 插槽类型推断，支持参数传递
defineSlots<{
  actions?: (ctx: { formState: Record<string, unknown>; handleSubmit: () => void; handleReset: () => void }) => unknown
  [key: string]: unknown
}>()

// 提交事件
const handleSubmit = () => {
  emit('submit', models.value)
}

// 重置事件
const handleReset = () => {
  // 重置为初始值（由父组件控制 v-model 的初始值）
  for (const key in models.value) {
    models.value[key] = ''
  }
  emit('reset')
}

// 已移除 defaultValues 相关逻辑
</script>

<template>
  <div class="search-container">
    <a-form :model="models" @submit.prevent="handleSubmit">
      <a-row :gutter="16">
        <a-col v-for="field in props.fields" :key="field.name" :span="8">
          <a-form-item :label="field.label">
            <slot :name="field.name" :value="models[field.name]" :field="field">
              <component :is="field.component || 'a-input'" v-model:value="models[field.name]" v-bind="field.props" />
            </slot>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" style="text-align: right">
          <slot name="actions" :form-state="models" :handleSubmit="handleSubmit" :handleReset="handleReset">
            <a-button type="primary" @click="handleSubmit"> 搜索 </a-button>
            <a-button style="margin-left: 8px" @click="handleReset"> 重置 </a-button>
          </slot>
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
