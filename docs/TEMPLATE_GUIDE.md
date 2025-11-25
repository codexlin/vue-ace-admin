# 标准化模板使用指南

本项目基于现有的 Pro 组件库和 Hooks 库，提供了一套标准化的页面模板，帮助开发者快速构建企业级管理系统的页面。

## 🎯 核心优势

- **高度复用**：基于现有组件库，最大化利用已有投资
- **配置驱动**：通过配置快速生成页面，无需重复编写业务逻辑
- **类型安全**：完整的 TypeScript 支持，配置即文档
- **易于扩展**：支持自定义组件和插槽
- **统一规范**：保证项目页面风格的一致性

## 📋 模板类型

### 1. StandardListPage - 标准列表页

用于展示数据列表，支持搜索、排序、分页等基础功能。

#### 基础用法

```vue
<template>
  <StandardListPage
    title="用户管理"
    :api="userApi.getUserList"
    :search-fields="searchFields"
    :table-columns="tableColumns"
    :toolbar-actions="toolbarActions"
    :row-actions="rowActions"
  />
</template>

<script setup lang="ts">
// 无需导入，自动导入已配置
import type { SearchField, ColumnConfig, ActionConfig } from '@/types/template'

// 搜索字段配置
const searchFields = [
  {
    name: 'userName',
    label: '用户名',
    component: 'a-input',
    placeholder: '请输入用户名'
  }
]

// 表格列配置
const tableColumns = [
  {
    title: '用户名',
    dataIndex: 'userName'
  }
]

// 工具栏操作
const toolbarActions = [
  {
    type: 'primary',
    label: '新增用户',
    handler: () => router.push('/user/create')
  }
]

// 行操作
const rowActions = [
  {
    type: 'link',
    label: '编辑',
    handler: (record) => router.push(`/user/edit/${record.id}`)
  }
]
</script>
```

#### 配置说明

##### SearchField 搜索字段配置

```typescript
interface SearchField {
  name: string              // 字段名
  label: string             // 标签文本
  component: string         // 组件类型
  defaultValue?: any        // 默认值
  placeholder?: string      // 占位符
  props?: Record<string, any>  // 组件属性
  options?: Array<{         // 选项（select、radio等）
    label: string
    value: any
  }>
  span?: number             // 栅格占位
  show?: boolean            // 是否显示
}
```

##### ColumnConfig 表格列配置

```typescript
interface ColumnConfig {
  title: string             // 列标题
  dataIndex: string        // 数据字段
  key?: string              // 唯一标识
  width?: number            // 列宽
  fixed?: 'left' | 'right' // 固定列
  render?: (value: any, record: any, index: number) => any  // 自定义渲染
}
```

##### ActionConfig 操作按钮配置

```typescript
interface ActionConfig {
  type: 'primary' | 'default' | 'danger' | 'link'
  label: string             // 按钮文本
  key?: string              // 唯一标识
  handler: (record?: any) => void  // 点击处理函数
  confirm?: {               // 确认弹窗配置
    title?: string
    content?: string
  }
  disabled?: boolean        // 是否禁用
  loading?: boolean         // 是否加载中
}
```

### 2. StandardDetailPage - 标准详情页

用于展示单个实体的详细信息，支持统计卡片和标签页。

#### 基础用法

```vue
<template>
  <StandardDetailPage
    :api="userApi.getUserDetail"
    :id="userId"
    title="用户详情"
    :detail-fields="detailFields"
    :statistics="statistics"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
// 详情字段配置
const detailFields = [
  {
    key: 'userName',
    label: '用户名',
    type: 'text'
  },
  {
    key: 'status',
    label: '状态',
    type: 'status',
    options: [
      { label: '正常', value: 1, color: 'green' },
      { label: '禁用', value: 0, color: 'red' }
    ]
  }
]

// 统计卡片配置
const statistics = [
  {
    key: 'loginCount',
    title: '登录次数',
    value: (data) => data.loginCount || 0
  }
]

// 标签页配置
const tabs = [
  {
    key: 'orders',
    title: '订单记录',
    component: UserOrders
  }
]
</script>
```

#### 配置说明

##### DetailField 详情字段配置

```typescript
interface DetailField {
  key: string               // 数据字段
  label: string             // 标签文本
  type: 'text' | 'date' | 'image' | 'tag' | 'link' | 'status'
  formatter?: (value: any) => string  // 自定义格式化
  options?: Array<{         // 状态选项
    label: string
    value: any
    color?: string
  }>
}
```

##### StatisticConfig 统计卡片配置

```typescript
interface StatisticConfig {
  key: string               // 唯一标识
  title: string             // 标题
  value: number | string | Function  // 值或值函数
  prefix?: any              // 前缀组件
  suffix?: string           // 后缀文本
  precision?: number        // 精度
  span?: number             // 栅格占位
}
```

### 3. StandardEditPage - 标准编辑页

用于创建或编辑实体信息，支持分布式表单和步骤验证。

#### 基础用法

```vue
<template>
  <StandardEditPage
    :save-api="saveUser"
    :detail-api="mode === 'edit' ? userApi.getUserDetail : undefined"
    :id="mode === 'edit' ? userId : undefined"
    :form-fields="formFields"
    :mode="mode"
    @success="handleSuccess"
  />
</template>

<script setup lang="ts">
// 表单字段配置
const formFields = [
  {
    name: 'userName',
    label: '用户名',
    component: 'a-input',
    required: true,
    rules: [
      { required: true, message: '请输入用户名' }
    ],
    props: {
      placeholder: '请输入用户名'
    }
  }
]

// 保存API
const saveUser = async (data: any) => {
  if (mode.value === 'create') {
    return await userApi.createUser(data)
  } else {
    return await userApi.updateUser(userId.value, data)
  }
}

// 成功回调
const handleSuccess = (data) => {
  message.success('保存成功')
  router.push('/user')
}
</script>
```

#### 配置说明

##### FormField 表单字段配置

```typescript
interface FormField {
  name: string               // 字段名
  label: string             // 标签文本
  component: string         // 组件类型
  required?: boolean        // 是否必填
  defaultValue?: any        // 默认值
  rules?: any[]             // 验证规则
  props?: Record<string, any>  // 组件属性
  options?: Array<{         // 选项
    label: string
    value: any
  }>
  dependencies?: string[]   // 依赖字段
  onChange?: (value: any) => void  // 值变化回调
}
```

## 🔧 高级用法

### 1. 自定义表格列渲染

```typescript
const tableColumns = [
  {
    title: '状态',
    dataIndex: 'status',
    render: (value, record) => {
      const statusMap = {
        1: { text: '正常', color: 'green' },
        0: { text: '禁用', color: 'red' }
      }
      const status = statusMap[value]
      return h('a-tag', { color: status.color }, status.text)
    }
  }
]
```

### 2. 条件显示操作按钮

```typescript
const rowActions = [
  {
    type: 'link',
    label: '审核',
    show: (record) => record.status === 0,  // 只有未审核状态才显示
    handler: (record) => handleAudit(record)
  },
  {
    type: 'link',
    label: '删除',
    disabled: (record) => record.isAdmin,  // 管理员不可删除
    handler: (record) => handleDelete(record)
  }
]
```

### 3. 动态表单字段

```typescript
const formFields = [
  {
    name: 'userType',
    label: '用户类型',
    component: 'a-select',
    onChange: (value) => {
      // 根据用户类型动态显示/隐藏其他字段
      if (value === 'admin') {
        // 显示管理员特有字段
      }
    }
  }
]
```

### 4. 使用插槽自定义内容

```vue
<template>
  <StandardListPage
    :api="api"
    :table-columns="columns"
  >
    <!-- 自定义工具栏 -->
    <template #toolbar>
      <a-space>
        <a-button @click="handleCustomAction">自定义操作</a-button>
        <slot name="extra-toolbar" />
      </a-space>
    </template>

    <!-- 自定义列渲染 -->
    <template #column-status="{ record }">
      <a-tag :color="record.status ? 'green' : 'red'">
        {{ record.status ? '正常' : '禁用' }}
      </a-tag>
    </template>
  </StandardListPage>
</template>
```

## 🚀 快速开始

### 1. 创建新的列表页面

```bash
# 创建页面文件
touch src/views/example/ExampleList.vue
```

```vue
<!-- src/views/example/ExampleList.vue -->
<template>
  <StandardListPage
    title="示例列表"
    :api="exampleApi.getList"
    :search-fields="searchFields"
    :table-columns="tableColumns"
    :toolbar-actions="toolbarActions"
    :row-actions="rowActions"
  />
</template>

<script setup lang="ts">
// 模板组件会自动导入，无需手动导入
import { exampleApi } from './api'
import type { SearchField, ColumnConfig, ActionConfig } from '@/types/template'

// 在这里配置你的页面
</script>
```

### 2. 创建API文件

```typescript
// src/views/example/api.ts
export const exampleApi = {
  getList: (params) => request.get('/example/list', { params }),
  getDetail: (id) => request.get(`/example/${id}`),
  create: (data) => request.post('/example', data),
  update: (id, data) => request.put(`/example/${id}`, data),
  delete: (id) => request.delete(`/example/${id}`)
}
```

### 3. 配置路由

```typescript
// src/router/modules/example.ts
export default {
  path: '/example',
  name: 'example',
  meta: { title: '示例管理' },
  component: () => import('@/views/example/ExampleList.vue')
}
```

## 🎨 最佳实践

### 1. 字段命名规范

- 使用驼峰命名法：`userName`、`createTime`
- 布尔值使用 is/has/can 前缀：`isActive`、`hasPermission`
- 时间字段使用 Time 后缀：`loginTime`

### 2. 组件选择

- 输入文本：`a-input`
- 选择器：`a-select`
- 日期选择：`a-date-picker`
- 数字输入：`a-input-number`
- 文件上传：`BaseUpload`
- 富文本编辑：`TinyMCE`

### 3. 验证规则

```typescript
const rules = [
  { required: true, message: '此字段为必填项' },
  { min: 3, max: 20, message: '长度为3-20个字符' },
  { type: 'email', message: '请输入正确的邮箱格式' },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
]
```

### 4. 错误处理

```typescript
try {
  await api.save(data)
  message.success('操作成功')
} catch (error) {
  errorMessage(error.message || '操作失败')
}
```

## 📝 注意事项

1. **数据一致性**：确保API返回的数据结构与模板期望的格式一致
2. **权限控制**：在操作按钮中添加权限判断逻辑
3. **性能优化**：大数据量列表建议使用虚拟滚动
4. **国际化**：标签文本建议使用国际化函数包装
5. **响应式**：确保页面在移动端的显示效果

## 🔗 相关链接

- [Ant Design Vue 文档](https://www.antdv.com/docs/vue/introduce-cn/)
- [Vue 3 文档](https://cn.vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)

通过使用这些标准化模板，你可以大幅提升开发效率，保证代码质量，快速构建出专业、规范的管理系统页面！