---
title: 快速开始
description: 快速上手 @ace-admin/ui 组件库
---

# 快速开始

本指南将帮助你快速开始使用 @ace-admin/ui 组件库。

## 安装

使用你喜欢的包管理器安装：

::: code-group

```bash [pnpm]
pnpm add @ace-admin/ui
```

```bash [npm]
npm install @ace-admin/ui
```

```bash [yarn]
yarn add @ace-admin/ui
```

:::

## 完整引入

在 `main.ts` 中引入所有组件：

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import AceAdminUI from '@ace-admin/ui'
import '@ace-admin/ui/dist/ace-admin-ui.css'

const app = createApp(App)
app.use(AceAdminUI)
app.mount('#app')
```

## 按需引入（推荐）

只引入需要的组件，减小打包体积：

```vue
<script setup lang="ts">
import { ProButton, ProTable, ProSearchForm } from '@ace-admin/ui'
import '@ace-admin/ui/dist/ace-admin-ui.css'
</script>

<template>
  <ProButton type="primary">点击我</ProButton>
</template>
```

## 基础示例

### 1. 使用 ProButton

ProButton 支持自动 loading 和确认弹窗功能。

:::demo

```vue
<template>
  <ProButton type="primary" :autoLoading="true" :onClick="handleClick">
    自动 Loading
  </ProButton>
</template>

<script setup>
import { ProButton } from '@ace-admin/ui'

const handleClick = async () => {
  // 异步操作，按钮会自动显示 loading
  await new Promise(resolve => setTimeout(resolve, 2000))
  console.log('操作完成')
}
</script>
```

:::

### 2. 使用 ProSearchForm

配置化的搜索表单组件。

:::demo

```vue
<template>
  <ProSearchForm
    v-model="searchForm"
    :fields="fields"
    @submit="handleSearch"
  />
</template>

<script setup>
import { ref } from 'vue'
import { ProSearchForm } from '@ace-admin/ui'

const searchForm = ref({
  username: '',
  status: ''
})

const fields = [
  {
    name: 'username',
    label: '用户名',
    component: 'a-input',
    props: { placeholder: '请输入用户名' }
  },
  {
    name: 'status',
    label: '状态',
    component: 'a-select',
    props: {
      options: [
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' }
      ]
    }
  }
]

const handleSearch = (values) => {
  console.log('搜索参数:', values)
}
</script>
```

:::

### 3. 使用 ProTable

增强的表格组件，支持斑马纹、工具栏等。

:::demo

```vue
<template>
  <ProTable
    :scroll="{ x: 1500, y: 300 }"
    :columns="columns"
    :dataSource="dataSource"
    isZebra="even"
    :useCardWrapper="true"
  >
    <template #toolbar>
      <a-button type="primary">新增</a-button>
    </template>
  </ProTable>
</template>

<script setup>
import { ref } from 'vue'
import { ProTable } from '@ace-admin/ui'

const columns = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age' },
  { title: '状态', dataIndex: 'status' }
]

const dataSource = ref([
  { id: 1, name: '张三', age: 28, status: '在职' },
  { id: 2, name: '李四', age: 32, status: '在职' }
])
</script>
```

:::

### 4. 使用 useList Hook

一体化列表数据管理。

:::demo

```vue
<template>
  <div>
    <ProSearchForm v-model="searchForm" :fields="fields" @submit="loadData" />
    <a-alert v-if="loadErrorMessage" type="error" :message="loadErrorMessage" class="mb-3" />
    <ProTable
      :scroll="{ x: 1500, y: 300 }"
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading"
      :pagination="{ current: curPage, pageSize, total }"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useList, ProTable, ProSearchForm, message, errorMessage } from '@ace-admin/ui'

const searchForm = ref({})

const {
  dataSource,
  loading,
  curPage,
  pageSize,
  total,
  error,
  loadData
} = useList({
  request: async (params) => {
    // 真实 API 请求
    const query = new URLSearchParams({
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      name: params.name || ''
    }).toString()
    const url = `https://m1.apifoxmock.com/m1/2120640-3081152-2c46b26a/getListByPage?apifoxToken=dROD5webTSINtKEixUxWWBYNnjoRsSXn&${query}`
    const res = await fetch(url)
    const json = await res.json()
    const data = json.data || {}
    return {
      data: data.list || [],
      total: data.total || 0
    }
  },
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

const fields = [
  { name: 'name', label: '姓名', component: 'a-input' },
  { name: 'age', label: '年龄', component: 'a-input-number' }
]

const columns = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age' }
]

// 使用 extra.immediate: true 自动加载，无需 onMounted
</script>
```

:::

## 完整 CRUD 示例

组合所有组件实现完整的 CRUD 功能。

:::demo

```vue
<template>
  <div>
    <!-- 搜索表单 -->
    <ProSearchForm
      v-model="searchForm"
      :fields="fields"
      @submit="loadData"
    />

    <!-- 数据表格 -->
    <ProTable
      :scroll="{ x: 1500, y: 300 }"
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading"
      :pagination="{ current: curPage, pageSize, total }"
      isZebra="even"
    >
      <template #toolbar>
        <ProButton type="primary">新增用户</ProButton>
        <ProButton>批量导出</ProButton>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="handleEdit(record)">编辑</a>
            <ProButton
              type="link"
              danger
              enableConfirm
              autoLoading
              :popConfig="{
                title: '确认删除',
                description: '删除后无法恢复，确定要删除吗？'
              }"
              :onClick="() => handleDelete(record)"
            >
              删除
            </ProButton>
          </a-space>
        </template>
      </template>
    </ProTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ProButton, ProSearchForm, ProTable, useList } from '@ace-admin/ui'
import { message } from 'ant-design-vue'

const searchForm = ref({ name: '', status: '' })

const { dataSource, loading, curPage, pageSize, total, loadData } = useList({
  request: async (params) => {
    // 真实 API 请求
    const query = new URLSearchParams({
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      name: params.name || '',
      status: params.status || ''
    }).toString()
    const url = `https://m1.apifoxmock.com/m1/2120640-3081152-2c46b26a/getListByPage?apifoxToken=dROD5webTSINtKEixUxWWBYNnjoRsSXn&${query}`
    const res = await fetch(url)
    const json = await res.json()
    const data = json.data || {}
    return {
      data: data.list || [],
      total: data.total || 0
    }
  },
  filters: {
    state: searchForm,
    autoWatch: true,
    resetPageOnChange: true,
    debounce: 300
  },
  extra: {
    immediate: true
  }
})

const fields = [
  { name: 'name', label: '用户名', component: 'a-input' },
  {
    name: 'status',
    label: '状态',
    component: 'a-select',
    props: {
      options: [
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' }
      ]
    }
  }
]

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '用户名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age' },
  { title: '状态', dataIndex: 'status' },
  { title: '操作', key: 'action', width: 200 }
]

const handleEdit = (record) => {
  message.info(`编辑用户: ${record.name}`)
}

const handleDelete = async (record) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  message.success('删除成功')
  await loadData()
}

// 组件挂载时加载初始数据
onMounted(() => {
  loadData()
})
</script>
```

:::

## 下一步

- [查看所有组件](/components/) - 了解更多组件用法
- [Hooks 文档](/hooks/useList) - 学习数据管理 Hook
- [场景示例](/scenarios/search-table) - 查看实际业务场景
- [主题定制](/guide/theme) - 自定义主题样式

## TypeScript 支持

所有组件和 Hooks 都提供完整的 TypeScript 类型定义：

```typescript
import type {
  ProButtonProps,
  ProTableProps,
  ProSearchFormProps,
  SearchField,
  UseListProps
} from '@ace-admin/ui'

// 完整的类型提示和检查
const fields: SearchField[] = [
  { name: 'username', label: '用户名', component: 'a-input' }
]
```

## 常见问题

### 如何全局注册组件？

```typescript
// main.ts
import AceAdminUI from '@ace-admin/ui'
import '@ace-admin/ui/dist/ace-admin-ui.css'

app.use(AceAdminUI)
```

### 如何按需引入？

直接从包中导入需要的组件即可，现代打包工具会自动 Tree Shaking。

### 是否需要单独引入 Ant Design Vue？

需要。`@ace-admin/ui` 将 `ant-design-vue` 作为 peer dependency，你需要在项目中安装：

```bash
pnpm add ant-design-vue
```

然后在 `main.ts` 中引入：

```typescript
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

app.use(Antd)
```
