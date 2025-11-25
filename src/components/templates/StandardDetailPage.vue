<template>
  <div class="standard-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <a-button v-if="showBack" type="text" size="small" @click="handleBack">
            <ArrowLeftOutlined />
            返回
          </a-button>
          <h2 class="page-title">{{ title || '详情页面' }}</h2>
        </div>
        <div class="header-actions">
          <slot name="header-actions" />
        </div>
      </div>
    </div>

    <a-spin :spinning="loading">
      <!-- 统计卡片区域 -->
      <div v-if="statisticsData.length > 0" class="statistics-section">
        <a-row :gutter="16">
          <a-col v-for="stat in statisticsData" :key="stat.key" :span="stat.span || 6">
            <StatisticCard
              :title="stat.title"
              :value="stat.value"
              :prefix="stat.prefix"
              :suffix="stat.suffix"
              :precision="stat.precision"
              :value-style="stat.valueStyle"
            />
          </a-col>
        </a-row>
      </div>

      <!-- 基础信息 -->
      <a-card v-if="processedDetailFields.length > 0" title="基础信息" class="detail-section">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item
            v-for="field in processedDetailFields"
            :key="field.key"
            :label="field.label"
            :span="field.span || 1"
          >
            <slot :name="`field-${field.key}`" :field="field" :value="detailData[field.key]">
              <!-- 自定义渲染 -->
              <template v-if="field.type === 'tag' && typeof field.value === 'object'">
                <a-tag :color="field.value.color">
                  {{ field.value.text }}
                </a-tag>
              </template>
              <template v-else-if="field.type === 'link' && typeof field.value === 'object'">
                <a :href="field.value.href" :target="field.value.target">
                  {{ field.value.text }}
                </a>
              </template>
              <template v-else>
                {{ field.value }}
              </template>
            </slot>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- 标签页区域 -->
      <a-card v-if="tabs && tabs.length > 0" class="tabs-section" :bordered="false">
        <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
          <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.title">
            <component :is="tab.component" v-if="activeTab === tab.key" :data="detailData" v-bind="tab.props" />
          </a-tab-pane>
        </a-tabs>
      </a-card>

      <!-- 自定义内容区域 -->
      <div class="custom-section">
        <slot />
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { StatisticCard } from '@codexlin/ace-admin-ui'
import type { DetailPageConfig } from '@/types/template'
import { useStandardDetailPage } from '@/composables/useStandardDetailPage'

interface Props {
  /** 详情API函数 */
  api: (id: string | number) => Promise<any>
  /** 数据ID */
  id: string | number
  /** 页面标题 */
  title?: string
  /** 详情字段配置 */
  detailFields?: any[]
  /** 统计卡片配置 */
  statistics?: any[]
  /** 标签页配置 */
  tabs?: any[]
  /** 是否显示返回按钮 */
  showBack?: boolean
  /** 返回URL */
  backUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  detailFields: () => [],
  statistics: () => [],
  tabs: () => [],
  showBack: true,
  backUrl: ''
})

const emit = defineEmits<{
  back: []
  tabChange: [key: string]
  refresh: []
}>()

// 使用标准详情页Hook
const { detailData, loading, activeTab, statisticsData, processedDetailFields, handleBack, refresh } =
  useStandardDetailPage({
    api: props.api,
    id: props.id,
    detailFields: props.detailFields,
    statistics: props.statistics,
    tabs: props.tabs,
    showBack: props.showBack,
    backUrl: props.backUrl
  })

// 标签页切换
const handleTabChange = (key: string) => {
  activeTab.value = key
  emit('tabChange', key)
}

// 暴露给父组件的方法
defineExpose({
  refresh,
  getData: () => detailData.value
})
</script>

<style scoped>
.standard-detail-page .page-header {
  margin-bottom: 24px;
  padding: 16px 0;
}

.standard-detail-page .header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.standard-detail-page .header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.standard-detail-page .page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.standard-detail-page .header-actions {
  flex-shrink: 0;
}

.standard-detail-page .statistics-section {
  margin-bottom: 24px;
}

.standard-detail-page .detail-section,
.standard-detail-page .tabs-section {
  margin-bottom: 16px;
}

.standard-detail-page .custom-section {
  margin-top: 16px;
}
</style>
