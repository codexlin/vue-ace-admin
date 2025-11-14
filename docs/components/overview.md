---
title: 组件总览
description: Vue Ace Admin 组件库所有组件一览
---

# 组件总览

Vue Ace Admin 组件库提供了一套完整的业务组件，帮助你快速构建企业级管理系统。

## 📦 组件分类

### 基础组件

#### ProButton 按钮

增强版按钮组件，提供自动 loading 和确认弹窗功能。

**核心特性**：
- ✅ 自动 Loading - 异步操作自动显示加载状态
- ✅ 确认弹窗 - 危险操作前弹出确认对话框
- ✅ Promise 支持 - 智能识别并处理异步回调

**快速使用**：
```vue
<ProButton type="primary" :autoLoading="true" @click="handleSave">
  保存
</ProButton>
```

[查看详细文档 →](/components/pro-button/)

---

### 业务组件

#### ProSearchForm 搜索表单

配置化的搜索表单组件，专为数据筛选场景设计。

**核心特性**：
- ✅ 配置驱动 - 通过配置数组快速生成表单
- ✅ 双向绑定 - 使用 v-model 管理表单数据
- ✅ 插槽扩展 - 支持自定义字段和操作按钮
- ✅ TypeScript - 完整的类型支持

**快速使用**：
```vue
<script setup>
const searchForm = ref({ name: '', age: '' })
const fields = [
  { name: 'name', label: '姓名', component: 'a-input' },
  { name: 'age', label: '年龄', component: 'a-input-number' }
]
</script>

<template>
  <ProSearchForm v-model="searchForm" :fields="fields" @submit="handleSearch" />
</template>
```

[查看详细文档 →](/components/pro-search-form/)

---

#### ProTable 表格

增强版表格组件，支持斑马纹、卡片包装等功能。

**核心特性**：
- ✅ 斑马纹样式 - 支持奇数/偶数行高亮
- ✅ 卡片包装 - 可选是否用卡片包裹
- ✅ 工具栏插槽 - 内置工具栏区域
- ✅ 主题适配 - 自动适配亮色/暗色主题

**快速使用**：
```vue
<ProTable
  :columns="columns"
  :dataSource="data"
  :isZebra="'even'"
  :useCardWrapper="true"
>
  <template #toolbar>
    <a-button type="primary">新增</a-button>
  </template>
</ProTable>
```

[查看详细文档 →](/components/pro-table/)

---

## 🎣 Hooks

### useList 列表管理

通用的列表数据管理 Hook，集成分页、筛选、加载等功能。

**核心特性**：
- ✅ 分页管理 - 自动处理页码、页大小
- ✅ 筛选支持 - 响应式筛选条件
- ✅ 加载状态 - 自动管理 loading 状态
- ✅ 钩子扩展 - `onSuccess` / `onError` 自定义联动

**快速使用**：
```vue
<script setup>
import { ref } from 'vue'
import { useList, message, errorMessage } from '@codexlin/ace-admin-ui'

const searchForm = ref({})

const { dataSource, loading, curPage, total, loadData, error } = useList({
  request: async (params) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(params)
    })
    return res.json()
  },
  filters: {
    state: searchForm,
    autoWatch: true,
    resetPageOnChange: true,
    debounce: 300
  },
  extra: {
    immediate: true,
    onSuccess: () => message('列表加载成功'),
    onError: (err) => errorMessage(err instanceof Error ? err.message : '获取数据失败')
  }
})
</script>
```

[查看详细文档 →](/hooks/useList)

---

## 🎯 场景示例

### 搜索表单 + 表格

最常见的后台管理页面场景，组合 ProSearchForm、ProTable 和 useList。

**典型用法**：
```vue
<script setup>
import { ref, computed } from 'vue'
import { ProSearchForm, ProTable, useList, message, errorMessage } from '@codexlin/ace-admin-ui'

const searchForm = ref({})
const { dataSource, loading, error, loadData } = useList({
  request: fetchData,
  filters: {
    state: searchForm,
    autoWatch: true,
    resetPageOnChange: true,
    debounce: 300
  },
  extra: {
    immediate: true,
    onSuccess: () => message('数据加载成功'),
    onError: (err) => errorMessage(err instanceof Error ? err.message : '数据加载失败')
  }
})

const loadErrorMessage = computed(() => (error?.value instanceof Error ? error.value.message : ''))
</script>

<template>
  <ProSearchForm v-model="searchForm" :fields="fields" @submit="loadData" />
  <a-alert v-if="loadErrorMessage" type="error" :message="loadErrorMessage" class="mb-3" />
  <ProTable :columns="columns" :dataSource="dataSource" :loading="loading" />
</template>
```

[查看完整示例 →](/scenarios/search-table)

---

## 📊 组件对比

| 组件 | 适用场景 | 核心功能 | 依赖组件 |
|------|----------|---------|----------|
| **ProButton** | 按钮操作 | 自动 Loading、确认弹窗 | a-button, a-popconfirm |
| **ProSearchForm** | 数据筛选 | 配置化表单、动态字段 | a-form, a-row, a-col |
| **ProTable** | 数据展示 | 斑马纹、工具栏 | a-table, a-card |
| **useList** | 数据管理 | 分页、筛选、加载 | - |

---

## 🚀 快速开始

1. **安装**
   ```bash
   pnpm add @codexlin/ace-admin-ui ant-design-vue
   ```

2. **引入**
   ```typescript
   import { ProButton, ProTable, ProSearchForm } from '@codexlin/ace-admin-ui'
   import '@codexlin/ace-admin-ui/dist/ace-admin-ui.css'
   ```

3. **使用**
   ```vue
   <ProButton type="primary">开始使用</ProButton>
   ```

---

## 💡 开发建议

1. **按需引入** - 只引入需要的组件，减小打包体积
2. **类型支持** - 使用 TypeScript 获得更好的开发体验
3. **插槽定制** - 利用插槽实现复杂的业务需求
4. **组合使用** - ProSearchForm + ProTable + useList 实现完整的 CRUD

---

## 下一步

- [快速开始](/guide/quick-start) - 5 分钟上手
- [安装指南](/guide/installation) - 详细的安装步骤
- [场景示例](/scenarios/search-table) - 实际业务场景
- [GitHub](https://github.com/codexlin/vue-ace-admin) - 查看源码
