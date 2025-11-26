# 模板组件

基于 Pro 组件库和 Hooks 库，提供标准化的页面模板，帮助快速构建企业级管理系统。

## 🎯 核心优势

- **高度复用** - 基于现有组件库，最大化利用已有投资
- **配置驱动** - 通过配置快速生成页面，无需重复编写业务逻辑
- **类型安全** - 完整的 TypeScript 支持，配置即文档
- **易于扩展** - 支持自定义组件和插槽
- **统一规范** - 保证项目页面风格的一致性

## 📦 模板类型

### StandardListPage - 列表页

用于展示数据列表，支持搜索、排序、分页等功能。

#### 在线演示

👉 [查看列表页演示](https://vue-ace-admin.vercel.app/example/template-demo) | [用户管理（新版）](https://vue-ace-admin.vercel.app/system/user-new)

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
import type { SearchField, ColumnConfig, ActionConfig } from '@/types/template'

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    name: 'userName',
    label: '用户名',
    component: 'a-input',
    placeholder: '请输入用户名'
  },
  {
    name: 'status',
    label: '状态',
    component: 'a-select',
    options: [
      { label: '全部', value: '' },
      { label: '正常', value: 1 },
      { label: '禁用', value: 0 }
    ]
  }
]

// 表格列配置
const tableColumns: ColumnConfig[] = [
  {
    title: '用户名',
    dataIndex: 'userName',
    width: 150
  },
  {
    title: '邮箱',
    dataIndex: 'email'
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (value) => value ? '正常' : '禁用'
  }
]

// 工具栏操作
const toolbarActions: ActionConfig[] = [
  {
    type: 'primary',
    label: '新增用户',
    handler: () => router.push('/user/create')
  }
]

// 行操作
const rowActions: ActionConfig[] = [
  {
    type: 'link',
    label: '编辑',
    handler: (record) => router.push(`/user/edit/${record.id}`)
  },
  {
    type: 'link',
    label: '删除',
    confirm: {
      title: '确认删除？',
      content: '删除后无法恢复'
    },
    handler: async (record) => {
      await userApi.delete(record.id)
      message.success('删除成功')
    }
  }
]
</script>
```

### StandardDetailPage - 详情页

用于展示单个实体的详细信息，支持统计卡片和标签页。

```vue
<template>
  <StandardDetailPage
    :api="userApi.getUserDetail"
    :id="userId"
    title="用户详情"
    :detail-fields="detailFields"
    :statistics="statistics"
  />
</template>

<script setup lang="ts">
import type { DetailField, StatisticConfig } from '@/types/template'

const detailFields: DetailField[] = [
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
  },
  {
    key: 'createTime',
    label: '创建时间',
    type: 'date'
  }
]

const statistics: StatisticConfig[] = [
  {
    key: 'loginCount',
    title: '登录次数',
    value: (data) => data.loginCount || 0
  }
]
</script>
```

### StandardEditPage - 编辑页

用于创建或编辑实体信息，支持表单验证和步骤式编辑。

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
import type { FormField } from '@/types/template'

const formFields: FormField[] = [
  {
    name: 'userName',
    label: '用户名',
    component: 'a-input',
    required: true,
    rules: [
      { required: true, message: '请输入用户名' },
      { min: 3, max: 20, message: '长度为3-20个字符' }
    ]
  },
  {
    name: 'email',
    label: '邮箱',
    component: 'a-input',
    required: true,
    rules: [
      { required: true, message: '请输入邮箱' },
      { type: 'email', message: '请输入正确的邮箱格式' }
    ]
  },
  {
    name: 'status',
    label: '状态',
    component: 'a-select',
    defaultValue: 1,
    options: [
      { label: '正常', value: 1 },
      { label: '禁用', value: 0 }
    ]
  }
]

const saveUser = async (data: any) => {
  if (mode.value === 'create') {
    return await userApi.createUser(data)
  } else {
    return await userApi.updateUser(userId.value, data)
  }
}

const handleSuccess = () => {
  message.success('保存成功')
  router.push('/user')
}
</script>
```

## 📝 配置说明

### SearchField - 搜索字段

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | `string` | ✅ | 字段名 |
| label | `string` | ✅ | 标签文本 |
| component | `string` | ✅ | 组件类型（a-input、a-select等） |
| placeholder | `string` | - | 占位符 |
| defaultValue | `any` | - | 默认值 |
| options | `Array<{label, value}>` | - | 选项（select、radio等） |
| props | `Record<string, any>` | - | 组件属性 |
| span | `number` | - | 栅格占位（1-24） |

### ColumnConfig - 表格列

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | `string` | ✅ | 列标题 |
| dataIndex | `string` | ✅ | 数据字段 |
| width | `number` | - | 列宽 |
| fixed | `'left' \| 'right'` | - | 固定列 |
| render | `Function` | - | 自定义渲染函数 |

### ActionConfig - 操作按钮

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | `'primary' \| 'default' \| 'danger' \| 'link'` | ✅ | 按钮类型 |
| label | `string` | ✅ | 按钮文本 |
| handler | `Function` | ✅ | 点击处理函数 |
| confirm | `{title, content}` | - | 确认弹窗配置 |
| disabled | `boolean \| Function` | - | 是否禁用 |
| show | `boolean \| Function` | - | 是否显示 |

### FormField - 表单字段

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | `string` | ✅ | 字段名 |
| label | `string` | ✅ | 标签文本 |
| component | `string` | ✅ | 组件类型 |
| required | `boolean` | - | 是否必填 |
| rules | `Array` | - | 验证规则 |
| defaultValue | `any` | - | 默认值 |
| options | `Array<{label, value}>` | - | 选项 |
| props | `Record<string, any>` | - | 组件属性 |

## 🔧 高级用法

### 自定义表格列渲染

```typescript
const tableColumns = [
  {
    title: '状态',
    dataIndex: 'status',
    render: (value, record) => {
      return h('a-tag', { 
        color: value ? 'green' : 'red' 
      }, value ? '正常' : '禁用')
    }
  }
]
```

### 条件显示操作按钮

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

### 使用插槽自定义内容

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

### 1. 创建页面文件

```bash
touch src/views/example/ExampleList.vue
```

### 2. 编写页面代码

```vue
<template>
  <StandardListPage
    title="示例列表"
    :api="exampleApi.getList"
    :search-fields="searchFields"
    :table-columns="tableColumns"
  />
</template>

<script setup lang="ts">
import { exampleApi } from './api'
import type { SearchField, ColumnConfig } from '@/types/template'

// 配置你的搜索字段和表格列
const searchFields: SearchField[] = [...]
const tableColumns: ColumnConfig[] = [...]
</script>
```

### 3. 配置路由

在 `src/router/router.ts` 中添加路由：

```typescript
{
  path: '/example',
  name: 'example',
  component: () => import('@/views/example/ExampleList.vue'),
  meta: {
    title: '示例管理'
  }
}
```

## 🎨 最佳实践

### 命名规范

- **驼峰命名**：`userName`、`createTime`
- **布尔值前缀**：`isActive`、`hasPermission`、`canEdit`
- **时间字段后缀**：`loginTime`、`createTime`

### 组件选择

| 场景 | 推荐组件 |
|------|---------|
| 文本输入 | `a-input` |
| 选择器 | `a-select` |
| 日期选择 | `a-date-picker` |
| 数字输入 | `a-input-number` |
| 开关 | `a-switch` |
| 单选 | `a-radio-group` |
| 多选 | `a-checkbox-group` |
| 文件上传 | `BaseUpload` |
| 富文本 | `TinyMCE` |

### 验证规则示例

```typescript
const rules = [
  { required: true, message: '此字段为必填项' },
  { min: 3, max: 20, message: '长度为3-20个字符' },
  { type: 'email', message: '请输入正确的邮箱格式' },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
  {
    validator: (rule, value) => {
      if (value && value < 18) {
        return Promise.reject('年龄必须大于18岁')
      }
      return Promise.resolve()
    }
  }
]
```

## 📌 注意事项

1. **数据一致性** - 确保 API 返回的数据结构与模板期望的格式一致
2. **权限控制** - 在操作按钮中添加权限判断逻辑
3. **性能优化** - 大数据量列表建议使用虚拟滚动
4. **国际化** - 标签文本建议使用 `t()` 函数包装
5. **响应式** - 确保页面在移动端的显示效果

## 🔗 相关资源

- [在线演示 - 模板组件](https://vue-ace-admin.vercel.app/example/template-demo)
- [在线演示 - 用户管理（新版）](https://vue-ace-admin.vercel.app/system/user-new)
- [ProTable 组件](/components/pro-table/)
- [ProSearchForm 组件](/components/pro-search-form/)
- [useList Hook](/hooks/useList)
