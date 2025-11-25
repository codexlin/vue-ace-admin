import { ref, computed } from 'vue'
import { useLoading } from '@codexlin/ace-admin-hooks'
import { message, errorMessage } from '@codexlin/ace-admin-ui'
import type { EditPageConfig, FormField, StepConfig } from '@/types/template'

export function useStandardEditPage(config: EditPageConfig) {
  const { loading, setLoading } = useLoading()

  // 表单相关
  const formRef = ref()
  const formData = ref<Record<string, any>>({})
  const currentStep = ref(0)

  // 初始化表单数据
  const initFormData = async () => {
    if (config.mode === 'edit' && config.detailApi && config.id) {
      setLoading(true)
      try {
        const response = await config.detailApi(config.id)
        formData.value = response.data || response
      } catch (error) {
        console.error('加载编辑数据失败:', error)
        errorMessage('加载数据失败')
      } finally {
        setLoading(false)
      }
    } else {
      // 设置默认值
      const defaultData: Record<string, any> = {}
      config.formFields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          defaultData[field.name] = field.defaultValue
        }
      })
      formData.value = defaultData
    }
  }

  // 验证单个步骤
  const validateStep = async (stepIndex: number): Promise<boolean> => {
    if (!config.steps || !config.steps[stepIndex]) return true

    const step = config.steps[stepIndex]
    if (step.validator) {
      try {
        return await step.validator()
      } catch (error) {
        console.error('步骤验证失败:', error)
        return false
      }
    }

    return true
  }

  // 保存处理
  const handleSave = async (onSuccess?: (data: any) => void) => {
    try {
      // 表单验证
      if (formRef.value) {
        await formRef.value.validate()
      }

      // 如果是多步骤，验证当前步骤
      if (config.steps && config.steps.length > 0) {
        const currentStepValid = await validateStep(currentStep.value)
        if (!currentStepValid) {
          errorMessage('请完善当前步骤信息')
          return
        }

        // 验证所有步骤
        for (let i = 0; i < config.steps.length; i++) {
          if (i !== currentStep.value) {
            const valid = await validateStep(i)
            if (!valid) {
              errorMessage(`第${i + 1}步信息不完整`)
              return
            }
          }
        }
      }

      setLoading(true)

      // 构建提交数据
      const submitData = config.mode === 'edit' ? { ...formData.value, id: config.id } : formData.value

      // 调用保存API
      const response = await config.saveApi(submitData)

      message(config.mode === 'create' ? '创建成功' : '保存成功')

      // 成功回调
      if (onSuccess) {
        onSuccess(response.data || response)
      }

      return response
    } catch (error) {
      console.error('保存失败:', error)
      errorMessage('保存失败，请检查表单信息')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 步骤相关方法
  const handleStepChange = async (step: number) => {
    // 验证当前步骤
    const currentValid = await validateStep(currentStep.value)
    if (!currentValid) {
      errorMessage('请完善当前步骤信息')
      return
    }

    currentStep.value = step
  }

  const handleNextStep = async () => {
    if (currentStep.value < (config.steps?.length || 0) - 1) {
      await handleStepChange(currentStep.value + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  // 重置表单
  const resetForm = () => {
    formData.value = {}
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }

  // 处理表单字段变化
  const handleFieldChange = (fieldName: string, value: any) => {
    formData.value[fieldName] = value

    // 处理依赖字段
    const field = config.formFields.find((f) => f.name === fieldName)
    if (field?.dependencies) {
      field.dependencies.forEach((depField) => {
        const depFieldConfig = config.formFields.find((f) => f.name === depField)
        if (depFieldConfig?.onChange) {
          depFieldConfig.onChange(value)
        }
      })
    }
  }

  // 表单配置处理
  const processedFormFields = computed(() => {
    return config.formFields.map((field) => ({
      ...field,
      // 处理选项数据
      options: field.options || []
    }))
  })

  // 当前步骤配置
  const currentStepConfig = computed(() => {
    if (!config.steps || !config.steps[currentStep.value]) {
      return null
    }
    return config.steps[currentStep.value]
  })

  // 初始化
  initFormData()

  return {
    // 数据状态
    formData,
    loading,
    currentStep,
    processedFormFields,
    currentStepConfig,
    formRef,

    // 方法
    initFormData,
    handleSave,
    handleStepChange,
    handleNextStep,
    handlePrevStep,
    resetForm,
    handleFieldChange,
    validateStep
  }
}
