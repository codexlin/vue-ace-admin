---
title: ProTable 表格
description: 增强版表格组件，支持斑马纹、卡片包装和工具栏插槽
---

# ProTable 表格

ProTable 是基于 Ant Design Vue Table 组件扩展的增强型表格，支持斑马纹行、卡片包装器和工具栏插槽，完全兼容原生 `<a-table>` 的所有属性和插槽。

---

## 代码示例

### 基础用法

:::demo

```vue
<template>
  <ProTable :columns="columns" :dataSource="data" />
</template>

<script setup>
import { ProTable } from 'vue-ace-admin-ui'

const columns = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age' }
]
const data = [
  { name: '张三', age: 28 },
  { name: '李四', age: 32 }
]
</script>
```
:::

---

### 斑马纹行

通过 `isZebra` 属性控制斑马纹样式，可选 `'none'`（无）、`'even'`（偶数行）、`'odd'`（奇数行）。

:::demo

```vue
<template>
  <ProTable :columns="columns" :dataSource="data" isZebra="even" />
</template>
```
:::

#### 自定义斑马纹配色

ProTable 内置两个 CSS 变量用于控制斑马纹颜色，业务可在全局样式中覆盖：

- `--ace-pro-table-zebra-bg-light`（默认 `#f6f6f6`）：亮色主题下的背景色
- `--ace-pro-table-zebra-bg-dark`（默认 `rgb(29 29 29)`）：暗色主题下的背景色

```vue
<template>
  <ProTable :columns="columns" :dataSource="data" isZebra="even" />
</template>

<style scoped>
:root {
  --ace-pro-table-zebra-bg-light: #fff7e6;
  --ace-pro-table-zebra-bg-dark: #2a1f15;
}
</style>
```

如果项目存在暗色主题容器，也可以单独覆盖：

```css
[data-theme='dark'] {
  --ace-pro-table-zebra-bg-dark: rgba(255, 255, 255, 0.08);
}
```

---

### 卡片包装器

通过 `useCardWrapper` 属性控制是否使用卡片包装表格，默认开启。

:::demo

```vue
<template>
  <ProTable :columns="columns" :dataSource="data" :useCardWrapper="false" />
</template>
```
:::

---

### 工具栏插槽

可通过 `toolbar` 插槽自定义表格工具栏内容。

:::demo

```vue
<template>
  <ProTable :columns="columns" :dataSource="data" isZebra="even">
    <template #toolbar>
      <a-space>
        <ProButton type="primary">新增</ProButton>
        <ProButton type="default">导出</ProButton>
        <ProButton type="dashed">刷新</ProButton>
      </a-space>
    </template>
  </ProTable>
</template>

<script setup>
import { ProTable, ProButton } from 'vue-ace-admin-ui'

const columns = [
  { title: 'ID', dataIndex: 'id', width: 60 },
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age', width: 80 }
]

const data = [
  { id: 1, name: '张三', age: 28 },
  { id: 2, name: '李四', age: 32 },
  { id: 3, name: '王五', age: 25 }
]
</script>
```
:::

---

### 完整示例（真实 API）

结合 `useList` 实现完整的分页、加载、CRUD 功能。

:::demo

```vue
<template>
  <a-alert v-if="loadErrorMessage" type="error" :message="loadErrorMessage" class="mb-3" />
  <ProTable
    :columns="columns"
    :dataSource="dataSource"
    :loading="loading"
    :pagination="{
      current: curPage,
      pageSize: pageSize,
      total: total,
      showSizeChanger: true,
      showTotal: (total) => `共 ${total} 条数据`
    }"
    isZebra="even"
    :useCardWrapper="true"
  >
    <template #toolbar>
      <a-space>
        <ProButton type="primary">新增用户</ProButton>
        <ProButton>导出</ProButton>
      </a-space>
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
              description: `确定要删除 ${record.name} 吗？`
            }"
            :onClick="() => handleDelete(record)"
          >
            删除
          </ProButton>
        </a-space>
      </template>
    </template>
  </ProTable>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ProTable, ProButton, useList, message, errorMessage } from 'vue-ace-admin-ui'

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
    const query = new URLSearchParams({
      pageNum: params.pageNum,
      pageSize: params.pageSize
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
  extra: {
    immediate: true,
    onSuccess: () => message('列表数据加载成功'),
    onError: (err) => errorMessage(err instanceof Error ? err.message : '获取列表失败')
  }
})

const loadErrorMessage = computed(() => (error?.value instanceof Error ? error.value.message : ''))

const columns = [
  { title: 'ID', dataIndex: 'id', width: 60 },
  { title: '姓名', dataIndex: 'name', width: 120 },
  { title: '操作', key: 'action', width: 150 }
]

function handleEdit(record) {
  message(`编辑: ${record.name}`)
}

async function handleDelete(record) {
  await new Promise((resolve) => setTimeout(resolve, 800))
  message(`已删除: ${record.name}`)
  await loadData()
}

// 使用 extra.immediate: true 自动加载，无需 onMounted
</script>
```

:::

---

## Props

| 属性名           | 类型                | 默认值   | 说明                       |
| ---------------- | ------------------- | -------- | -------------------------- |
| `isZebra`        | `'none' \| 'even' \| 'odd'` | `'none'` | 斑马纹行样式控制           |
| `useCardWrapper` | `boolean`           | `true`   | 是否使用卡片包装器         |
| 其他属性         | 同 [a-table](https://www.antdv.com/components/table) | - | 支持所有原生 a-table 属性  |

> 💡 ProTable 内部直接透传了 Ant Design Vue 的 Table props，可以像使用原生 `<a-table>` 一样 `v-bind`：
>
> ```vue
> <script setup>
> import { reactive } from 'vue'
>
> const tableOptions = reactive({
>   columns,
>   dataSource,
>   pagination: { current: 1, pageSize: 10 },
>   isZebra: 'even'
> })
> </script>
>
> <template>
>   <ProTable v-bind="tableOptions" />
> </template>
> ```


---

## Slots

| 插槽名    | 说明                       |
| --------- | -------------------------- |
| `toolbar` | 表格上方工具栏内容         |
| 其他插槽  | 同原生 a-table，支持全部插槽 |

---

## 说明

### 核心特性

- ✅ **斑马纹样式** - 自动适配 light/dark 主题
- ✅ **卡片包装** - 可选是否使用卡片包裹表格
- ✅ **工具栏插槽** - 灵活的工具栏区域
- ✅ **完全兼容** - 支持所有 Ant Design Vue Table 的属性和插槽
- ✅ **插槽透传** - 所有表格插槽自动转发

### 斑马纹实现

```css
/* 亮色主题 */
[data-theme='light'] .ant-table-striped .table-striped td {
  background-color: #f6f6f6;
}

/* 暗色主题 */
[data-theme='dark'] .ant-table-striped .table-striped td {
  background-color: rgb(29 29 29);
}
```

### 常用插槽

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| `toolbar` | 工具栏区域 | - |
| `bodyCell` | 自定义单元格 | `{ text, record, index, column }` |
| `headerCell` | 自定义表头单元格 | `{ title, column }` |
| `expandedRowRender` | 展开行内容 | `{ record, index }` |
| `summary` | 总结栏 | `{ pageData }` |

### 与 useList 配合使用

```vue
<script setup>
const { dataSource, loading, curPage, pageSize, total } = useList({
  request: async (params) => {
    // API 请求
    return { data: [...], total: 100 }
  },
  extra: {
    immediate: true
  }
})
</script>

<template>
  <ProTable
    :dataSource="dataSource"
    :loading="loading"
    :pagination="{ current: curPage, pageSize, total }"
  />
</template>
```

---

## 最佳实践

1. **滚动配置（scroll）**

   #### ✅ 推荐：使用 `x: 'max-content'`
   ```vue
   <ProTable
     :columns="columns"
     :dataSource="dataSource"
     :scroll="{ x: 'max-content' }"
   />
   ```
   **优点**：
   - ✅ 自动根据列宽度计算
   - ✅ 响应式适配
   - ✅ 不会浪费空间

   #### ❌ 不推荐：写死宽度
   ```vue
   :scroll="{ x: 1500, y: 300 }"  <!-- ❌ 写死宽度，不灵活 -->
   ```

   #### 📋 何时使用不同的 scroll 配置

   | 场景 | 配置 | 说明 |
   |------|------|------|
   | **一般表格** | 不设置或 `{ x: 'max-content' }` | 自适应容器 |
   | **列很多** | `{ x: 'max-content' }` | 自动横向滚动 |
   | **固定表头** | `{ y: 400 }` | 超过高度纵向滚动 |
   | **列多+固定表头** | `{ x: 'max-content', y: 400 }` | 双向滚动 |
   | **大数据虚拟滚动** | `{ x: 'max-content', y: 600 }` + `:virtual="true"` | 性能优化 |

2. **分页配置**
   ```vue
   :pagination="{
     current: curPage,
     pageSize: pageSize,
     total: total,
     showSizeChanger: true,      // 显示页大小选择器
     showQuickJumper: true,      // 显示快速跳转
     showTotal: (total) => `共 ${total} 条`
   }"
   ```

3. **固定列**
   ```typescript
   const columns = [
     { title: 'ID', dataIndex: 'id', fixed: 'left', width: 60 },
     { title: '操作', key: 'action', fixed: 'right', width: 200 }
   ]
   ```

4. **行选择**
   ```vue
   :row-selection="{
     selectedRowKeys: selectedKeys,
     onChange: onSelectChange
   }"
   ```

---

## 相关文档

- [ProSearchForm 搜索表单](/components/pro-search-form/)
- [useList Hook](/hooks/useList)
- [完整场景示例](/scenarios/search-table)
