import { ref, computed } from 'vue'
import { useLoading } from '@codexlin/ace-admin-hooks'
import { StatisticCard } from '@codexlin/ace-admin-ui'
import type { DetailPageConfig, DetailField } from '@/types/template'

export function useStandardDetailPage(config: DetailPageConfig) {
  const { loading, setLoading } = useLoading()

  // 详情数据
  const detailData = ref<Record<string, any>>({})
  const activeTab = ref(config.tabs?.[0]?.key || '')

  // 加载详情数据
  const loadDetail = async () => {
    if (!config.api) return

    setLoading(true)
    try {
      const response = await config.api(config.id)
      detailData.value = response.data || response
    } catch (error) {
      console.error('加载详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 格式化显示值
  const formatValue = (field: DetailField, value: any) => {
    if (value === null || value === undefined || value === '') {
      return '-'
    }

    if (field.formatter) {
      return field.formatter(value)
    }

    switch (field.type) {
      case 'date':
        return value ? new Date(value).toLocaleString() : '-'
      case 'status':
        const option = field.options?.find((opt) => opt.value === value)
        return option ? option.label : value
      case 'tag':
        const tagOption = field.options?.find((opt) => opt.value === value)
        return tagOption ? { text: tagOption.label, color: tagOption.color || 'blue' } : value
      case 'link':
        return { href: field.href || value, text: value, target: field.target || '_blank' }
      default:
        return value
    }
  }

  // 处理统计卡片数据
  const statisticsData = computed(() => {
    if (!config.statistics) return []

    return config.statistics.map((stat) => ({
      ...stat,
      value: typeof stat.value === 'function' ? stat.value(detailData.value) : stat.value
    }))
  })

  // 处理详情字段数据
  const processedDetailFields = computed(() => {
    if (!config.detailFields) return []

    return config.detailFields.map((field) => ({
      ...field,
      value: formatValue(field, detailData.value[field.key])
    }))
  })

  // 返回上一页
  const handleBack = () => {
    if (config.backUrl) {
      window.location.href = config.backUrl
    } else {
      window.history.back()
    }
  }

  // 刷新数据
  const refresh = () => {
    loadDetail()
  }

  // 自动加载数据
  if (config.id && config.api) {
    loadDetail()
  }

  return {
    // 数据状态
    detailData,
    loading,
    activeTab,
    statisticsData,
    processedDetailFields,

    // 方法
    loadDetail,
    refresh,
    handleBack,
    formatValue
  }
}
