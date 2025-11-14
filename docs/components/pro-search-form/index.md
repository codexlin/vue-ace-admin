---
title: ProSearchForm 搜索表单
description: 动态搜索表单组件，支持配置驱动、插槽自定义和受控数据管理
---

# ProSearchForm 搜索表单

`ProSearchForm` 是一个基于 Vue 3.4+ 的动态搜索/筛选表单组件，支持配置驱动生成表单项、受控数据管理（v-model）、字段和操作区插槽自定义，适用于后台管理系统、数据筛选等场景。

---

## 组件特性

- **配置驱动**：通过 `fields` 数组自动生成表单项。
- **受控模式**：表单数据由父组件通过 `v-model` 完全控制。
- **插槽灵活**：支持字段级插槽和操作区插槽，满足高度自定义需求。
- **事件友好**：支持标准的提交和重置事件。
- **类型安全**：使用 Vue 3.4+ 新特性，开发体验更好。

---

## 代码示例

### 基础用法

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { ProSearchForm } from '@codexlin/ace-admin-ui'

const searchForm = ref({
  name: '',
  age: ''
})

const fields = [
  { name: 'name', label: '姓名', component: 'a-input', props: { placeholder: '请输入姓名' } },
  { name: 'age', label: '年龄', component: 'a-input-number', props: { min: 0, max: 120 } }
]

function handleSubmit(data) {
  console.log('搜索数据:', data)
}
function handleReset() {
  console.log('表单已重置')
}
</script>

<template>
  <ProSearchForm
    v-model="searchForm"
    :fields="fields"
    @submit="handleSubmit"
    @reset="handleReset"
  />
</template>
```
:::

---

## 搭配 ProTable + useList 使用

`ProSearchForm` 通常与 `ProTable` 和 `useList` 组合，实现完整的数据筛选、分页功能。

:::demo

```vue
<template>
  <div>
    <ProSearchForm
      v-model="searchForm"
      :fields="fields"
      @submit="loadData"
      @reset="handleReset"
    />
    <ProTable
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading"
      :pagination="{
        current: curPage,
        pageSize: pageSize,
        total: total,
        showTotal: (total) => `共 ${total} 条`
      }"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ProSearchForm, ProTable } from '@codexlin/ace-admin-ui'
import { useList } from '@codexlin/ace-admin-hooks'

const searchForm = ref({ name: '' })

const { dataSource, loading, curPage, pageSize, total, loadData, reset } = useList({
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
    immediate: true
  }
})

const fields = [
  { name: 'name', label: '姓名', component: 'a-input', props: { placeholder: '请输入姓名', allowClear: true } }
]

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '姓名', dataIndex: 'name' }
]

async function handleReset() {
  curPage.value = 1
  await reset()
}

onMounted(() => {
  loadData()
})
</script>
```
:::

---

### 字段插槽自定义

你可以通过具名插槽自定义某个字段的渲染方式。

:::demo

```vue
<template>
  <ProSearchForm v-model="searchForm" :fields="fields" @submit="handleSubmit">
    <!-- 自定义年龄字段，使用滑块 -->
    <template #age="{ value, field }">
      <a-slider v-model:value="searchForm.age" :min="0" :max="120" />
      <div style="margin-top: 8px; color: #999;">当前值: {{ searchForm.age }}</div>
    </template>
  </ProSearchForm>
</template>

<script setup>
import { ref } from 'vue'
import { ProSearchForm } from '@codexlin/ace-admin-ui'

const searchForm = ref({
  name: '',
  age: 25
})

const fields = [
  { name: 'name', label: '姓名', component: 'a-input' },
  { name: 'age', label: '年龄' }  // 不指定 component，将使用插槽自定义
]

function handleSubmit(data) {
  console.log('提交数据:', data)
}
</script>
```
:::

---

### 操作区插槽自定义

你可以通过 `actions` 插槽自定义操作按钮区。

:::demo

```vue
<template>
  <ProSearchForm v-model="searchForm" :fields="fields" @submit="handleSubmit">
    <template #actions="{ formState, handleSubmit, handleReset }">
      <a-space>
        <a-button type="primary" @click="handleSubmit">
          高级搜索
        </a-button>
        <a-button @click="handleReset">
          清空
        </a-button>
        <a-button type="dashed" @click="exportData(formState)">
          导出筛选条件
        </a-button>
      </a-space>
    </template>
  </ProSearchForm>
</template>

<script setup>
import { ref } from 'vue'
import { ProSearchForm } from '@codexlin/ace-admin-ui'
import { message } from 'ant-design-vue'

const searchForm = ref({
  name: '',
  status: ''
})

const fields = [
  { name: 'name', label: '用户名', component: 'a-input' },
  {
    name: 'status',
    label: '状态',
    component: 'a-select',
    props: {
      options: [
        { label: '在职', value: '1' },
        { label: '离职', value: '0' }
      ]
    }
  }
]

function handleSubmit(data) {
  console.log('提交数据:', data)
  message.success('搜索成功')
}

function exportData(formState) {
  console.log('导出筛选条件:', formState)
  message.info(`导出条件: ${JSON.stringify(formState)}`)
}
</script>
```
:::

---

## Props

| 属性名    | 类型                | 默认值   | 说明                       |
| --------- | ------------------- | -------- | -------------------------- |
| fields    | `Field[]`           | `[]`     | 表单字段配置数组           |
| v-model   | `Record<string, any>` | -      | 表单数据，受控模式         |

### Field 类型说明

```ts
interface Field {
  name: string                // 字段名（对应表单数据 key）
  label: string               // 字段标签
  component?: string          // 表单项组件类型（如 'a-input', 'a-select'）
  props?: Record<string, any> // 组件属性
}
```

---

## Slots

| 插槽名      | 说明                                           |
| ----------- | ---------------------------------------------- |
| `actions`   | 操作区插槽，参数：formState, handleSubmit, handleReset |
| `字段名`    | 字段级插槽，参数：value, field                 |

---

## Events

| 事件名      | 参数类型                | 说明                       |
| ----------- | ----------------------- | -------------------------- |
| `submit`    | `Record<string, any>`   | 表单提交时触发，返回表单数据 |
| `reset`     | 无                      | 表单重置时触发             |

---

## 重要说明

### 重置行为

`handleReset()` 会将所有表单字段重置为**空字符串** `''`，而不是 `undefined`。

```typescript
// 重置后的效果
searchForm.value = {
  name: '',      // 空字符串
  age: '',       // 空字符串
  status: ''     // 空字符串
}
```

如果你需要自定义重置行为，可以监听 `@reset` 事件：

```vue
<ProSearchForm
  v-model="searchForm"
  :fields="fields"
  @reset="handleCustomReset"
/>

<script setup>
function handleCustomReset() {
  // 自定义重置逻辑
  searchForm.value = {
    name: '',
    age: undefined,  // 或者其他默认值
    status: null
  }
}
</script>
```

### 字段插槽的正确用法

字段插槽接收 `{ value, field }` 参数，但 `value` **不是响应式的**，不能直接用于 `v-model`。

#### ❌ 错误用法
```vue
<template #age="{ value }">
  <a-slider v-model:value="value" />  <!-- ❌ value 不是响应式 -->
</template>
```

#### ✅ 正确用法
```vue
<template #age="{ field }">
  <!-- 直接使用 searchForm[field.name] -->
  <a-slider v-model:value="searchForm[field.name]" />
</template>

<!-- 或者直接使用字段名 -->
<template #age>
  <a-slider v-model:value="searchForm.age" />
</template>
```

### 默认行为

- **默认组件**：如果不指定 `component`，默认使用 `a-input`
- **默认布局**：3 列布局（每个字段 `span="8"`）
- **默认间距**：列间距 `gutter="16"`
- **默认按钮**：提供 "搜索" 和 "重置" 按钮

### 表单布局

组件使用 Ant Design Vue 的栅格系统（24 列），每个字段占 8 列（即 3 列布局）：

```vue
<a-row :gutter="16">
  <a-col :span="8">字段1</a-col>  <!-- 占 8/24 -->
  <a-col :span="8">字段2</a-col>  <!-- 占 8/24 -->
  <a-col :span="8">字段3</a-col>  <!-- 占 8/24 -->
</a-row>
```

如需调整布局，可以通过 CSS 或自定义字段实现。

---

## 最佳实践

### ✅ 推荐做法

1. **使用 v-model**
   ```vue
   <ProSearchForm v-model="searchForm" :fields="fields" />
   ```

2. **配置驱动**
   ```typescript
   const fields = [
     { name: 'username', label: '用户名', component: 'a-input' },
     { name: 'status', label: '状态', component: 'a-select', props: { options } }
   ]
   ```

3. **事件处理**
   ```vue
   <ProSearchForm
     @submit="loadData"    // 提交时加载数据
     @reset="handleReset"  // 重置时的额外逻辑
   />
   ```

4. **与 useList 配合**
   ```typescript
   const { loadData, reset } = useList({
     request: fetchData,
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

   <ProSearchForm
     v-model="searchForm"
     @submit="loadData"
     @reset="reset"
   />
   ```

### ⚠️ 注意事项

1. **插槽中访问表单值**
   - 使用 `searchForm[field.name]` 或 `searchForm.字段名`
   - 不要直接使用插槽参数中的 `value`（非响应式）

2. **重置行为**
   - 默认重置为空字符串 `''`
   - 如需自定义，监听 `@reset` 事件

3. **字段组件**
   - 必须支持 `v-model:value`
   - 常用组件：`a-input`, `a-select`, `a-input-number`, `a-date-picker`, `a-range-picker`

---

## 适用场景

- ✅ 列表页的搜索/筛选栏
- ✅ 高级筛选表单
- ✅ 快速生成可配置的表单项
- ✅ 需要自定义操作按钮或表单项的场景
- ✅ 与 ProTable + useList 组合使用

---

## 相关文档

- [ProTable 表格组件](/components/pro-table/)
- [useList Hook](/hooks/useList)
- [完整场景示例](/scenarios/search-table)
