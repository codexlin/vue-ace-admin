---
title: 搜索表单 + 表格
description: 典型后台筛选与展示场景
---

# 搜索表单 + 表格

本场景展示如何在后台管理系统中，使用 ProSearchForm 与 ProTable 组件实现数据筛选、分页、CRUD 等典型业务需求。

---

## 业务场景

- 顶部为筛选条件输入区（搜索表单）
- 下方为数据表格展示区
- 支持搜索、重置、批量操作、导出等功能
- 适用于用户管理、订单管理、数据分析等后台页面

---

## 基础示例

> 适合简单场景，不使用 useList，仅演示表单与表格联动。

:::demo

```vue
<template>
  <div>
    <ProSearchForm
      v-model="searchForm"
      :fields="fields"
      @submit="handleSearch"
    />
    <ProTable :columns="columns" :dataSource="tableData" :loading="loading" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ProSearchForm, ProTable } from '@codexlin/ace-admin-ui'

const searchForm = ref({ name: '' })
const loading = ref(false)
const tableData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' }
])

const fields = [
  { name: 'name', label: '姓名', component: 'a-input', props: { placeholder: '请输入姓名', allowClear: true } }
]

const columns = [
  { title: 'ID', dataIndex: 'id', width: 60 },
  { title: '姓名', dataIndex: 'name', width: 120 }
]

async function handleSearch(formData) {
  loading.value = true
  // 模拟筛选
  tableData.value = [
    { id: 1, name: '张三' },
    { id: 2, name: '李四' },
    { id: 3, name: '王五' },
    { id: 4, name: '赵六' },
    { id: 5, name: '孙七' },
    { id: 6, name: '周八' },
    { id: 7, name: '吴九' },
    { id: 8, name: '郑十' },
    { id: 9, name: '钱一' },
    { id: 10, name: '陈二' },
    { id: 11, name: '林三' },
    { id: 12, name: '黄四' },
    { id: 13, name: '何五' },
    { id: 14, name: '高六' },
    { id: 15, name: '蒋七' },
    { id: 16, name: '傅八' },
    { id: 17, name: '邓九' },
    { id: 18, name: '宋十' },
    { id: 19, name: '吕一' },
    { id: 20, name: '曹二' }
  ].filter(item => !formData.name || item.name.includes(formData.name))
  loading.value = false
}
</script>
```

:::

---

## 推荐场景：useList Hook + 组件组合

> 推荐用法，自动管理分页、筛选、重置、加载态，模拟真实业务数据。

:::demo

```vue
<template>
  <div class="user-management">
    <ProSearchForm
      v-model="searchForm"
      :fields="fields"
      @submit="loadData"
      @reset="handleReset"
    >
      <template #actions="{ handleSubmit, handleReset }">
        <a-space>
          <ProButton type="primary" @click="handleSubmit">搜索</ProButton>
          <ProButton @click="handleReset">重置</ProButton>
          <a-button type="link" @click="handleAdvancedSearch">高级搜索</a-button>
        </a-space>
      </template>
    </ProSearchForm>

    <a-alert v-if="loadErrorMessage" type="error" :message="loadErrorMessage" class="mb-3" />
    <ProTable
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading"
      :scroll="{ x: 'max-content' }"
      :pagination="{
        current: curPage,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条数据`,
        pageSizeOptions: ['5', '10', '20', '50'],
        onChange: handlePageChange,
        onShowSizeChange: handleSizeChange
      }"
      isZebra="even"
      :useCardWrapper="true"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
    >
      <template #toolbar>
        <a-space>
          <ProButton type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            新增用户
          </ProButton>
          <ProButton @click="handleExport">
            <template #icon><DownloadOutlined /></template>
            导出数据
          </ProButton>
          <ProButton
            danger
            :disabled="selectedRowKeys.length === 0"
            enableConfirm
            :popConfig="{
              title: '批量删除确认',
              description: `确定要删除选中的 ${selectedRowKeys.length} 个用户吗？`
            }"
            :onClick="handleBatchDelete"
          >
            批量删除 ({{ selectedRowKeys.length }})
          </ProButton>
        </a-space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === '在职' ? 'green' : 'red'">{{ record.status }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="handleView(record)">查看</a>
            <a @click="handleEdit(record)">编辑</a>
            <ProButton
              type="link"
              danger
              enableConfirm
              autoLoading
              :popConfig="{
                title: '确认删除',
                description: `确定要删除用户 ${record.name} 吗？`,
                okText: '确定删除',
                cancelText: '取消'
              }"
              :onClick="() => handleDelete(record)"
            >删除</ProButton>
          </a-space>
        </template>
      </template>
    </ProTable>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ProSearchForm, ProTable, ProButton, useList, message, errorMessage } from '@codexlin/ace-admin-ui'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons-vue'

// 模拟用户数据库
const selectedRowKeys = ref([])
const searchForm = ref({ name: '' })

const {
  dataSource,
  loading,
  curPage,
  pageSize,
  total,
  error,
  loadData,
  reset
} = useList({
  request: async (params) => {
    const query = new URLSearchParams({
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      name: params.name || ''
    }).toString();
    const url = `https://m1.apifoxmock.com/m1/2120640-3081152-2c46b26a/getListByPage?apifoxToken=dROD5webTSINtKEixUxWWBYNnjoRsSXn&${query}`;
    const res = await fetch(url);
    const json = await res.json();
    const data = json.data || {};
    return {
      data: data.list || [],
      total: data.total || 0
    };
  },
  filters: {
    state: searchForm,
    autoWatch: true,
    resetPageOnChange: true,
    debounce: 300
  },
  extra: {
    immediate: true,
    onSuccess: () => message('✅ 数据加载成功'),
    onError: (err) => errorMessage(err instanceof Error ? err.message : '❌ 数据加载失败')
  }
})

const loadErrorMessage = computed(() => (error?.value instanceof Error ? error.value.message : ''))

const fields = [
  { name: 'name', label: '姓名', component: 'a-input', props: { placeholder: '请输入姓名', allowClear: true } }
]

const columns = [
  { title: 'ID', dataIndex: 'id', width: '50%' },
  { title: '姓名', dataIndex: 'name', width: '50%' }
]

// 分页事件处理
function handlePageChange(page, size) {
  console.log('📄 页码变化:', page, '每页:', size)
  curPage.value = page
  // ✅ useList 的 watch 会自动触发 loadData(page)
}

function handleSizeChange(current, size) {
  console.log('📏 页大小变化:', size)
  pageSize.value = size
  curPage.value = 1  // 改变页大小时重置到第一页
  // ✅ useList 的 watch 会自动触发 loadData()
}

// 重置事件处理
async function handleReset() {
  selectedRowKeys.value = []
  curPage.value = 1  // 重置时跳转到第一页
  await reset()
  message('✅ 筛选条件已重置')
}

// 行选择事件
function onSelectChange(selectedKeys) {
  selectedRowKeys.value = selectedKeys
  console.log('✅ 选中行:', selectedKeys)
}

// CRUD 操作
function handleAdd() {
  message('💡 打开新增用户对话框')
}

function handleEdit(record) {
  message(`✏️ 编辑用户: ${record.name}`)
}

function handleView(record) {
  message(`👁️ 查看用户: ${record.name}`)
}

async function handleDelete(record) {
  // 模拟删除 API
  await new Promise(resolve => setTimeout(resolve, 800))
  message(`✅ 用户 ${record.name} 已删除`)

  // 删除后重新加载当前页
  // 如果当前页删除后没有数据了，跳转到上一页
  if (dataSource.value.length === 1 && curPage.value > 1) {
    curPage.value = curPage.value - 1
  } else {
    await loadData()
  }
}

async function handleBatchDelete() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  message(`✅ 已删除 ${selectedRowKeys.value.length} 个用户`)
  selectedRowKeys.value = []

  // 批量删除后智能跳转页码
  await loadData()
}

function handleExport() {
  const params = {
    ...searchForm.value,
    pageNum: curPage.value,
    pageSize: pageSize.value
  }
  console.log('📥 导出参数:', params)
  message(`📥 正在导出 ${total.value} 条数据...`)
}

function handleAdvancedSearch() {
  message('💡 打开高级搜索面板')
}

// 组件挂载时加载初始数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
  background: #f5f5f5;
}
</style>
```

:::

---

## 分页逻辑详解

### ✅ useList 自动分页机制

`useList` Hook 内部实现了完整的分页自动化：

```typescript
// useList 内部实现
watch([curPage, pageSize], async () => {
  await loadData(curPage.value)  // 页码或页大小变化时自动重新加载
})
```

**这意味着**：
- ✅ 改变 `curPage.value` → 自动加载新页数据
- ✅ 改变 `pageSize.value` → 自动重新加载
- ✅ 无需手动调用 `loadData()`

### 📊 分页事件处理流程

#### 1. **页码切换**
```typescript
function handlePageChange(page, size) {
  curPage.value = page
  // ✅ useList 的 watch 检测到 curPage 变化
  // ✅ 自动调用 loadData(page)
  // ✅ 请求参数: { pageNum: page, pageSize, ...searchForm }
}
```

#### 2. **页大小改变**
```typescript
function handleSizeChange(current, size) {
  pageSize.value = size
  curPage.value = 1  // 重要：改变页大小时重置到第一页
  // ✅ useList 的 watch 检测到变化
  // ✅ 自动调用 loadData(1)
}
```

#### 3. **搜索筛选**
```typescript
// ProSearchForm 的 submit 事件
@submit="loadData"

// 点击搜索按钮
→ 触发 loadData()
→ 保持当前页码和页大小
→ 请求参数: { pageNum: curPage.value, pageSize.value, ...searchForm.value }
```

#### 4. **重置筛选**
```typescript
async function handleReset() {
  curPage.value = 1  // 重置到第一页
  await reset()      // useList 的 reset 方法
  // ✅ reset() 内部会清空 filters.state 并调用 loadData()
}
```

#### 5. **删除后的智能分页**
```typescript
async function handleDelete(record) {
  // ... 删除逻辑 ...

  // 如果当前页只有这一条数据，且不是第一页
  if (dataSource.value.length === 1 && curPage.value > 1) {
    curPage.value = curPage.value - 1  // 跳转到上一页
  } else {
    await loadData()  // 重新加载当前页
  }
}
```

### 🔄 完整的分页流程图

```
用户操作
  ↓
┌──────────────────────────────────┐
│ 1. 点击页码 (第 3 页)             │
│    → handlePageChange(3, 10)     │
│    → curPage.value = 3           │
└──────────────────────────────────┘
  ↓
┌──────────────────────────────────┐
│ 2. useList 的 watch 检测到变化   │
│    → watch([curPage, pageSize])  │
│    → 触发 loadData(3)            │
└──────────────────────────────────┘
  ↓
┌──────────────────────────────────┐
│ 3. loadData 构造请求参数         │
│    → params = {                  │
│         pageNum: 3,              │
│         pageSize: 10,            │
│         name: searchForm.name    │
│       }                          │
└──────────────────────────────────┘
  ↓
┌──────────────────────────────────┐
│ 4. 调用 request(params)          │
│    → fetch API                   │
│    → 返回第 3 页数据             │
└──────────────────────────────────┘
  ↓
┌──────────────────────────────────┐
│ 5. useList 自动更新状态          │
│    → dataSource.value = 新数据   │
│    → total.value = 总数          │
│    → loading.value = false       │
└──────────────────────────────────┘
  ↓
表格显示第 3 页数据 ✅
```

---

## 关键点总结

### ✅ useList 的强大之处

1. **自动分页监听**
   - `watch([curPage, pageSize])` 自动监听变化
   - 无需手动绑定事件
   - 修改页码/页大小即可触发加载

2. **参数自动合并**
   ```typescript
   { pageNum, pageSize, ...filters.state.value }
   // 自动合并筛选条件和分页参数
   ```

3. **智能状态管理**
   - `loading` 自动管理
   - `dataSource` 自动更新
   - `total` 自动同步

### ✅ 分页事件绑定

```vue
<ProTable
  :columns="columns"
  :dataSource="dataSource"
  :loading="loading"
  :pagination="{
    current: curPage,           // ✅ 绑定当前页
    pageSize: pageSize,         // ✅ 绑定页大小
    total: total,               // ✅ 绑定总数
    onChange: handlePageChange, // ✅ 页码变化事件
    onShowSizeChange: handleSizeChange  // ✅ 页大小变化事件
  }"
/>
```

### ✅ 智能页码处理

**场景 1: 删除当前页最后一条**
```typescript
if (dataSource.value.length === 1 && curPage.value > 1) {
  curPage.value = curPage.value - 1  // 跳转到上一页
}
```

**场景 2: 搜索后重置页码**
```typescript
// 搜索时保持当前页码，但如果结果少于当前页，会自动调整
@submit="loadData"  // 不改变 curPage
```

**场景 3: 重置时回到第一页**
```typescript
async function handleReset() {
  curPage.value = 1
  await reset()
}
```

---

## 扩展建议

### 1. **记住用户的分页偏好**
```typescript
import { useLocalStorage } from '@vueuse/core'

const pageSize = useLocalStorage('user-list-page-size', 10)
// 用户选择的页大小会被记住
```

### 2. **URL 同步分页状态**
```typescript
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const curPage = ref(Number(route.query.page) || 1)

watch(curPage, (newPage) => {
  router.replace({ query: { ...route.query, page: newPage } })
})
// 页码会反映在 URL 中，支持刷新保持状态
```

### 3. **虚拟滚动优化大数据**
```typescript
// 当数据量巨大时（10000+ 条）
// 考虑使用虚拟滚动替代传统分页
```

---

## 相关文档

- [ProSearchForm 详细文档](/components/pro-search-form/)
- [ProTable 详细文档](/components/pro-table/)
- [ProButton 详细文档](/components/pro-button/)
- [useList Hook 详细文档](/hooks/useList)
