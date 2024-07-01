<script setup lang="ts">
const props = defineProps({
  fields: {
    type: Array,
    required: true
  },
  defaultValues: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['submit', 'reset'])
// 获取当前组件实例
const instance = getCurrentInstance()
// 表单状态管理
const formState = reactive({ ...props.defaultValues })
// 提交表单
const handleSubmit = () => {
  if (instance?.vnode.props?.onSubmit) {
    emits('submit', formState)
  } else {
    console.log('默认提交行为:', formState)
    // 执行默认提交行为
  }
}

// 重置表单
const handleReset = () => {
  for (const key in formState) {
    formState[key] = props.defaultValues[key] || ''
  }
  if (instance?.vnode.props?.onReset) {
    emits('reset')
  } else {
    console.log('默认重置行为')
    // 执行默认重置行为
  }
}

// 监听默认值的变化以更新表单状态
watchEffect(() => {
  for (const key in props.defaultValues) {
    formState[key] = props.defaultValues[key]
  }
})
</script>

<template>
  <div class="search-container">
    <a-form @submit.prevent="handleSubmit">
      <a-row :gutter="16">
        <!-- 动态生成表单字段 -->
        <a-col :span="8" v-for="field in fields" :key="field.name">
          <a-form-item :label="field.label">
            <component :is="field.component || 'a-input'" v-model:value="formState[field.name]" v-bind="field.props" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" style="text-align: right">
          <a-button type="primary" @click="handleSubmit">搜索</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
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
