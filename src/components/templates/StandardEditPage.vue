<template>
  <div class="standard-edit-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <a-button v-if="showBack" type="text" size="small" @click="handleBack">
            <ArrowLeftOutlined />
            返回
          </a-button>
          <h2 class="page-title">{{ title || pageTitle }}</h2>
        </div>
        <div class="header-actions">
          <a-space>
            <a-button @click="handleCancel"> 取消 </a-button>
            <ProButton type="primary" :auto-loading="true" :loading="loading" @click="handleSave">
              {{ mode === 'create' ? '创建' : '保存' }}
            </ProButton>
          </a-space>
        </div>
      </div>
    </div>

    <a-spin :spinning="loading">
      <!-- 分布表单步骤指示器 -->
      <div v-if="steps && steps.length > 0" class="steps-section">
        <a-steps :current="currentStep" @change="handleStepChange">
          <a-step v-for="(step, index) in steps" :key="index" :title="step.title" :description="step.description" />
        </a-steps>
      </div>

      <!-- 表单区域 -->
      <a-card class="form-section" :bordered="false">
        <!-- 多步骤表单 -->
        <div v-if="steps && steps.length > 0">
          <div v-for="(step, index) in steps" :key="index">
            <component
              :is="step.component"
              v-show="currentStep === index"
              ref="stepRefs"
              :form-data="formData"
              v-bind="step.props"
              @field-change="handleFieldChange"
            />
          </div>
        </div>

        <!-- 单页表单 -->
        <FormModal
          v-else
          ref="formRef"
          :form-items="processedFormFields"
          :form-data="formData"
          @field-change="handleFieldChange"
        />
      </a-card>

      <!-- 步骤操作按钮 -->
      <div v-if="steps && steps.length > 0" class="step-actions">
        <a-space>
          <a-button v-if="currentStep > 0" @click="handlePrevStep"> 上一步 </a-button>
          <a-button v-if="currentStep < steps.length - 1" type="primary" @click="handleNextStep"> 下一步 </a-button>
        </a-space>
      </div>

      <!-- 底部操作按钮 -->
      <div v-if="showBottomActions" class="bottom-actions">
        <a-space size="large">
          <a-button @click="handleCancel"> 取消 </a-button>
          <ProButton type="primary" :auto-loading="true" :loading="loading" @click="handleSave">
            {{ mode === 'create' ? '创建' : '保存' }}
          </ProButton>
        </a-space>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { ProButton } from '@codexlin/ace-admin-ui'

import type { EditPageConfig } from '@/types/template'

import { useStandardEditPage } from '@/composables/useStandardEditPage'

interface Props {
  /** 保存API函数 */
  saveApi: (data: any) => Promise<any>
  /** 详情API函数（编辑模式使用） */
  detailApi?: (id: string | number) => Promise<any>
  /** 数据ID（编辑模式使用） */
  id?: string | number
  /** 页面标题 */
  title?: string
  /** 表单字段配置 */
  formFields: any[]
  /** 页面模式 */
  mode: 'create' | 'edit'
  /** 步骤配置 */
  steps?: any[]
  /** 是否显示返回按钮 */
  showBack?: boolean
  /** 是否显示底部操作按钮 */
  showBottomActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  steps: () => [],
  detailApi: undefined,
  id: undefined,
  showBack: true,
  showBottomActions: true
})

const emit = defineEmits<{
  success: [data: any]
  cancel: []
  back: []
  fieldChange: [fieldName: string, value: any]
  error: [error: any]
}>()

// 计算页面标题
const pageTitle = computed(() => {
  if (props.title) return props.title
  return props.mode === 'create' ? '创建' : '编辑'
})

// 使用标准编辑页Hook
const {
  formData,
  loading,
  currentStep,
  processedFormFields,
  currentStepConfig,
  formRef,
  stepRefs,
  initFormData,
  handleSave: doSave,
  handleStepChange,
  handleNextStep,
  handlePrevStep,
  handleFieldChange
} = useStandardEditPage({
  saveApi: props.saveApi,
  detailApi: props.detailApi,
  id: props.id,
  formFields: props.formFields,
  mode: props.mode,
  steps: props.steps
})

// 保存处理
const handleSave = async () => {
  try {
    const response = await doSave((data) => {
      emit('success', data)
    })
    return response
  } catch (error) {
    console.error('保存失败:', error)
    emit('error', error)
  }
}

// 取消操作
const handleCancel = () => {
  emit('cancel')
}

// 返回操作
const handleBack = () => {
  emit('back')
}

// 监听字段变化
watch(
  formData,
  (newData) => {
    Object.keys(newData).forEach((key) => {
      if (newData[key] !== formData.value[key]) {
        emit('fieldChange', key, newData[key])
      }
    })
  },
  { deep: true }
)

// 暴露给父组件的方法
defineExpose({
  save: handleSave,
  reset: () => {
    formData.value = {}
    void initFormData()
  },
  getData: () => formData.value,
  validate: () => formRef.value?.validate(),
  setFieldValue: (fieldName: string, value: any) => {
    formData.value[fieldName] = value
  }
})
</script>

<style scoped>
.standard-edit-page .page-header {
  margin-bottom: 24px;
  padding: 16px 0;
}

.standard-edit-page .header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.standard-edit-page .header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.standard-edit-page .page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.standard-edit-page .header-actions {
  flex-shrink: 0;
}

.standard-edit-page .steps-section {
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 6px;
}

.standard-edit-page .form-section {
  margin-bottom: 24px;
}

.standard-edit-page .step-actions {
  margin-bottom: 24px;
  text-align: center;
}

.standard-edit-page .bottom-actions {
  margin-top: 24px;
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}
</style>
