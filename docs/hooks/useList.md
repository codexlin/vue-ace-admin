---
title: useList 列表数据管理 hooks
description: 通用列表数据获取、分页、筛选、重置 hooks
---

# useList 列表数据管理 hooks

`useList` 是一个通用的列表数据管理 hooks，适用于后台管理系统的数据表格、筛选、分页等场景。它可以与 ProTable、ProSearchForm 等组件组合使用，实现高效的数据筛选与展示。

---

## 功能介绍

- 列表数据请求与管理
- 分页、筛选、重置功能
- 加载态、总数、当前页等状态自动管理
- 支持请求成功/失败钩子，方便外部接入任意提示方案
- 自动记录最近一次错误，便于在界面上展示
- **类型安全**：采用规范泛型参数，所有数据和参数均有类型约束

---

## 代码示例

```vue
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ProTable, ProSearchForm, message, errorMessage } from '@codexlin/ace-admin-ui'
import { useList } from '@codexlin/ace-admin-hooks'

interface User {
  name: string;
  age: number;
}
interface SearchFilter {
  name?: string;
  age?: number;
}

const searchForm = ref<SearchFilter>({ name: '', age: '' })

async function fetchTableData(params: SearchFilter): Promise<{ data: User[]; total: number }> {
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
}

const handleLoadError = (err) => {
  errorMessage(err instanceof Error ? err.message : '获取列表数据失败')
}

const {
  dataSource,
  loading,
  curPage,
  pageSize,
  total,
  error,
  loadData,
  reset
} = useList<User, SearchFilter>({
  request: fetchTableData,
  filters: {
    state: searchForm,
    autoWatch: true,
    resetPageOnChange: true,
    debounce: 300
  },
  extra: {
    immediate: true,
    onSuccess: () => message('数据加载成功'),
    onError: handleLoadError
  }
})

const loadErrorMessage = computed(() => (error?.value instanceof Error ? error.value.message : ''))

const fields = [
  { name: 'name', label: '姓名', component: 'a-input', props: { placeholder: '请输入姓名' } },
  { name: 'age', label: '年龄', component: 'a-input-number', props: { min: 0, max: 120 } }
]

const columns = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age' }
]

// 使用 extra.immediate: true 自动加载，无需 onMounted
</script>

<template>
  <ProSearchForm v-model="searchForm" :fields="fields" @submit="loadData" @reset="reset" />
  <a-alert v-if="loadErrorMessage" type="error" :message="loadErrorMessage" class="mb-3" />
  <ProTable :scroll="{ x: 1500, y: 300 }" :columns="columns" :dataSource="dataSource" :loading="loading" />
</template>
```

---

## 参数说明

### 泛型参数

- `ItemType`：列表项类型（如 User）
- `FilterOption`：筛选条件类型（如 SearchFilter）

### useList 参数

| 参数名         | 类型                                         | 说明                       |
| -------------- | -------------------------------------------- | -------------------------- |
| request        | `ListRequestFnType<ItemType, FilterOption>`  | 列表数据请求方法，返回带 data/total 的对象 |
| filters        | `UseListFiltersConfig<FilterOption>`         | 筛选配置（可选）           |
| pagination     | `UseListPaginationConfig`                   | 分页配置（可选）           |
| extra          | `UseListExtraOptions<ItemType, FilterOption, Response>` | 其他配置（可选）       |

### filters 配置

| 字段名                  | 类型/默认值                      | 说明                                                                 |
| ----------------------- | -------------------------------- | -------------------------------------------------------------------- |
| `state`                 | `Ref<FilterOption>`              | 筛选条件状态（响应式）                                               |
| `autoWatch`             | `boolean` (默认 `false`)         | 是否自动监听筛选条件变化并触发请求                                   |
| `resetPageOnChange`     | `boolean` (默认 `true`)          | 筛选条件变化时是否重置到第一页                                       |
| `debounce`              | `number` (默认 `0`)               | 筛选条件变化的防抖延迟（毫秒），仅在 `autoWatch: true` 时生效        |

### pagination 配置

| 字段名                  | 类型/默认值                      | 说明                                                                 |
| ----------------------- | -------------------------------- | -------------------------------------------------------------------- |
| `state`                 | `{ current?: Ref<number>; pageSize?: Ref<number> }` | 分页状态（可选，默认内部管理）                     |
| `autoWatch`             | `boolean` (默认 `true`)          | 是否自动监听分页变化并触发请求                                       |
| `initialCurrent`        | `number` (默认 `1`)              | 初始页码                                                             |
| `initialPageSize`       | `number` (默认 `10`)             | 初始页大小                                                           |

### extra 配置

| 字段名              | 类型/默认值                      | 说明                                                                 |
| ------------------- | -------------------------------- | -------------------------------------------------------------------- |
| `immediate`         | `boolean` (默认 `false`)         | 是否在初始化时立即执行一次 `loadData`                               |
| `onSuccess`         | `(ctx) => void`                  | 请求成功回调，携带响应、数据、总数、请求参数                         |
| `onError`           | `(error) => void`                | 请求失败回调                                                         |
| `transform`         | `(response) => { items; total }` | 自定义响应转换逻辑，适配非标准接口                                  |
| `buildParams`       | `(ctx) => Record<string, any>`   | 自定义请求参数构建（可结合筛选项、分页、额外参数）                 |
| `resetFilters`      | `(filtersRef) => void`           | 自定义筛选项重置逻辑（默认回退到初始表单状态）                      |

> 💡 如需结合 UI 组件显示提示，可在传入 `options.onSuccess` / `options.onError` 时调用 `@codexlin/ace-admin-ui` 导出的 `message`、`errorMessage` 等工具函数，或直接使用你项目中已有的消息体系。

---

## 返回值说明

| 返回值         | 类型               | 说明                       |
| -------------- | ------------------ | -------------------------- |
| dataSource     | `Ref<ItemType[]>`  | 列表数据                   |
| loading        | `Ref<boolean>`     | 加载状态                   |
| total          | `Ref<number>`      | 总数据量                   |
| error          | `Ref<unknown>`     | 最近一次请求的错误对象      |
| curPage        | `Ref<number>`      | 当前页码                   |
| pageSize       | `Ref<number>`      | 分页大小                   |
| loadData       | `(page?: number, extra?: Record<string, any>) => Promise<Response \| undefined>` | 加载数据方法 |
| reset          | `() => Promise<Response \| undefined> \| void` | 重置筛选条件并重新加载       |
| setCurPage     | `(page: number, options?: { emitLoad?: boolean }) => void` | 设置当前页，支持控制是否触发请求 |
| setPageSize    | `(size: number, options?: { emitLoad?: boolean }) => void` | 设置分页大小，支持控制是否触发请求 |

---

## 推荐场景

- 与 ProTable、ProSearchForm 组合使用，实现数据筛选与展示
- 后台管理系统的列表页
- 需要分页、筛选、重置功能的数据管理场景

---

如需更多 hooks 工具或场景示例，欢迎查阅其他文档或提出需求！
