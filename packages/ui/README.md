# vue-ace-admin-ui

> Vue 3 组件库，基于 Ant Design Vue 构建

## 介绍

`vue-ace-admin-ui` 是一个基于 Vue 3 和 Ant Design Vue 的组件库，提供了常用的增强型 UI 组件，帮助开发者快速构建企业级应用。

## 特性

- 🚀 **Vue 3 + TypeScript** - 完整的 TypeScript 支持，享受类型安全和智能提示
- 🎨 **基于 Ant Design Vue** - 完全兼容 Ant Design Vue 组件的所有属性、事件和插槽
- ⚡ **开箱即用** - 零配置，安装即用
- 🔧 **增强功能** - 在保持原有功能基础上，提供实用的增强特性
- 📦 **按需引入** - 支持 Tree Shaking，减小打包体积
- 🎯 **企业级** - 适用于中后台应用开发

## 安装

```bash
# npm
npm install vue-ace-admin-ui ant-design-vue vue

# yarn
yarn add vue-ace-admin-ui ant-design-vue vue

# pnpm
pnpm add vue-ace-admin-ui ant-design-vue vue
```

## 快速开始

### 完整引入

```js
// main.js
import { createApp } from 'vue'
import AceAdminUI from 'vue-ace-admin-ui'
import 'vue-ace-admin-ui/style.css'
import 'ant-design-vue/dist/antd.css' // 或者使用你的主题样式

const app = createApp(App)
app.use(AceAdminUI)
app.mount('#app')
```

### 按需引入

```vue
<template>
  <ProButton
    type="primary"
    :auto-loading="true"
    @click="handleSubmit"
  >
    提交
  </ProButton>
</template>

<script setup>
import { ProButton } from 'vue-ace-admin-ui'
import 'vue-ace-admin-ui/style.css'

const handleSubmit = async () => {
  // 返回 Promise，按钮会自动显示 loading 状态
  await new Promise(resolve => setTimeout(resolve, 2000))
  console.log('提交完成')
}
</script>
```

## 组件

### ProButton - 增强按钮

基于 `a-button` 扩展，支持自动加载状态和确认弹窗功能。

```vue
<template>
  <!-- 基础用法 - 支持所有 a-button 属性 -->
  <ProButton type="primary" size="large">
    普通按钮
  </ProButton>

  <!-- 自动加载功能 -->
  <ProButton
    type="primary"
    :auto-loading="true"
    @click="handleAsync"
  >
    异步操作
  </ProButton>

  <!-- 确认弹窗功能 -->
  <ProButton
    type="primary"
    danger
    :enable-confirm="true"
    :pop-config="{
      title: '确认删除',
      description: '此操作不可恢复，确定继续吗？',
      okText: '确定删除',
      cancelText: '取消'
    }"
    @click="handleDelete"
  >
    删除数据
  </ProButton>

  <!-- 组合功能 -->
  <ProButton
    type="primary"
    :auto-loading="true"
    :enable-confirm="true"
    :pop-config="{ title: '确认提交' }"
    @click="handleConfirmSubmit"
  >
    确认并提交
  </ProButton>
</template>

<script setup>
const handleAsync = async () => {
  // 自动显示 loading，异步完成后自动隐藏
  await fetch('/api/submit')
}

const handleDelete = () => {
  console.log('用户确认后执行删除')
}

const handleConfirmSubmit = async () => {
  // 用户确认后，自动显示 loading，异步完成后自动隐藏
  await submitData()
}
</script>
```

#### ProButton API

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| autoLoading | 是否自动显示 loading 状态 | `boolean` | `false` |
| enableConfirm | 是否启用确认弹窗 | `boolean` | `false` |
| popConfig | 确认弹窗配置 | `PopconfirmProps` | - |
| onClick | 点击事件处理函数 | `(event: MouseEvent) => void \| Promise<any>` | - |

> **注意**: ProButton 完全支持 `a-button` 的所有原生属性、事件和插槽。

### ProTable - 增强表格

基于 `a-table` 扩展，支持斑马纹效果和工具栏功能。

```vue
<template>
  <ProTable
    :dataSource="tableData"
    :columns="columns"
    :is-zebra="'even'"
    :use-card-wrapper="true"
    :pagination="pagination"
    @change="handleTableChange"
  >
    <!-- 工具栏插槽 -->
    <template #toolbar>
      <div style="display: flex; justify-content: space-between;">
        <a-space>
          <a-button type="primary">新增</a-button>
          <a-button>导出</a-button>
        </a-space>
        <a-input-search placeholder="搜索..." />
      </div>
    </template>

    <!-- 支持所有 a-table 插槽 -->
    <template #bodyCell="{ column, record, text }">
      <a-tag v-if="column.key === 'status'" color="green">
        {{ text }}
      </a-tag>
    </template>
  </ProTable>
</template>

<script setup>
const tableData = [
  { key: '1', name: '张三', status: '正常' },
  { key: '2', name: '李四', status: '禁用' },
]

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '状态', dataIndex: 'status', key: 'status' },
]
</script>
```

#### ProTable API

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| isZebra | 斑马纹模式 | `'even' \| 'odd' \| 'none'` | `'none'` |
| useCardWrapper | 是否使用卡片包装 | `boolean` | `true` |

> **注意**: ProTable 完全支持 `a-table` 的所有原生属性、事件和插槽。

## TypeScript 支持

```typescript
import type { ProButtonProps, ProTableProps } from 'vue-ace-admin-ui'

const buttonProps: ProButtonProps = {
  autoLoading: true,
  enableConfirm: true,
  popConfig: {
    title: '确认操作',
    description: '确定执行此操作吗？'
  },
  onClick: async (event: MouseEvent) => {
    // 完整的类型提示
    console.log('按钮点击', event)
    return Promise.resolve()
  }
}
```

## 浏览器兼容性

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 依赖版本

- Vue >= 3.3.0
- Ant Design Vue >= 4.0.0

## 开发

```bash
# 克隆项目
git clone https://github.com/yourusername/vue-ace-admin.git

# 进入 ui 包目录
cd vue-ace-admin/packages/ui

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build
```

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

[MIT](LICENSE)

## 更新日志

### v0.1.0

- 🎉 首次发布
- ✨ 新增 ProButton 组件，支持自动加载和确认弹窗
- ✨ 新增 ProTable 组件，支持斑马纹和工具栏
- 📝 完整的 TypeScript 类型定义
- 📦 支持 ES Module 和 CommonJS
