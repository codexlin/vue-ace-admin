---
title: ProButton 按钮
description: 增强版按钮组件，支持自动加载和确认弹窗功能
---

# ProButton 按钮

ProButton 是基于 Ant Design Vue 的 Button 组件扩展的增强版按钮，提供了自动加载和确认弹窗等额外功能。

## 代码示例

### 基础用法

基础的按钮用法，支持所有原生按钮的类型和样式。

```vue
<template>
  <div>
    <ProButton type="primary">主要按钮</ProButton>
    <ProButton type="default">默认按钮</ProButton>
    <ProButton type="dashed">虚线按钮</ProButton>
    <ProButton type="link">链接按钮</ProButton>
    <ProButton type="text">文本按钮</ProButton>
  </div>
</template>

<script setup>
import { ProButton } from '@ace-admin/ui'
</script>

<style scoped>
div {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
```

### 尺寸类型

按钮支持三种尺寸：大、默认、小。

```vue
<template>
  <div>
    <ProButton size="large">大按钮</ProButton>
    <ProButton>默认按钮</ProButton>
    <ProButton size="small">小按钮</ProButton>
  </div>
</template>

<script setup>
import { ProButton } from '@ace-admin/ui'
</script>

<style scoped>
div {
  display: flex;
  gap: 8px;
}
</style>
```

### 图标按钮

支持在按钮中添加图标。

```vue
<template>
  <div>
    <ProButton icon="search">搜索</ProButton>
    <ProButton icon="download" type="primary">下载</ProButton>
    <ProButton icon="edit" type="dashed">编辑</ProButton>
  </div>
</template>

<script setup>
import { ProButton } from '@ace-admin/ui'
</script>

<style scoped>
div {
  display: flex;
  gap: 8px;
}
</style>
```

### 自动加载

当按钮点击事件返回 Promise 时，可以启用 `autoLoading` 属性，自动显示加载状态。

```vue
<template>
  <div>
    <ProButton type="primary" :autoLoading="true" @click="handleAsyncClick">自动加载</ProButton>
  </div>
</template>

<script setup>
import { ProButton } from '@ace-admin/ui'

const handleAsyncClick = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('异步操作完成')
      resolve()
    }, 2000)
  })
}
</script>

<style scoped>
div {
  display: flex;
  gap: 8px;
}
</style>
```

### 确认弹窗

当设置 `enableConfirm` 为 true 时，按钮点击会显示确认弹窗。

```vue
<template>
  <div>
    <ProButton type="primary" :enableConfirm="true" @click="handleConfirm">删除</ProButton>
  </div>
</template>

<script setup>
import { ProButton } from '@ace-admin/ui'
import { message } from 'ant-design-vue'

const handleConfirm = () => {
  message.success('删除成功')
}
</script>

<style scoped>
div {
  display: flex;
  gap: 8px;
}
</style>
```

### 自定义确认弹窗

可以自定义确认弹窗的内容。

```vue
<template>
  <div>
    <ProButton 
      type="primary" 
      :enableConfirm="true" 
      :popConfig="confirmConfig"
      @click="handleCustomConfirm"
    >
      自定义确认
    </ProButton>
  </div>
</template>

<script setup>
import { ProButton } from '@ace-admin/ui'
import { message } from 'ant-design-vue'

const confirmConfig = {
  title: '重要提示',
  description: '确定要执行此操作吗？此操作不可逆转。',
  okText: '确定',
  cancelText: '取消',
  okType: 'danger'
}

const handleCustomConfirm = () => {
  message.success('操作成功')
}
</script>

<style scoped>
div {
  display: flex;
  gap: 8px;
}
</style>
```

### 实际应用场景

#### 删除操作（带确认和加载）

这是一个常见的删除操作场景，结合了确认弹窗和自动加载功能。

```vue
<template>
  <div>
    <ProButton 
      type="primary" 
      danger
      :enableConfirm="true"
      :autoLoading="true"
      @click="handleDelete"
    >
      删除用户
    </ProButton>
  </div>
</template>

<script setup>
import { ProButton } from '@ace-admin/ui'
import { message } from 'ant-design-vue'

const handleDelete = async () => {
  // 模拟 API 调用
  await new Promise((resolve) => setTimeout(resolve, 2000))
  message.success('用户删除成功')
}
</script>

<style scoped>
div {
  display: flex;
  gap: 8px;
}
</style>
```

#### 提交表单（自动加载）

当表单提交需要异步处理时，自动加载功能非常有用。

```vue
<template>
  <div>
    <ProButton 
      type="primary" 
      :autoLoading="true"
      @click="handleSubmit"
    >
      提交表单
    </ProButton>
  </div>
</template>

<script setup>
import { ProButton } from '@ace-admin/ui'
import { message } from 'ant-design-vue'

const handleSubmit = async () => {
  // 模拟表单提交
  await new Promise((resolve) => setTimeout(resolve, 1500))
  message.success('表单提交成功')
}
</script>

<style scoped>
div {
  display: flex;
  gap: 8px;
}
</style>
```

#### 业务操作（结合多种功能）

实际项目中，按钮可能需要结合多种功能。

```vue
<template>
  <div>
    <ProButton 
      type="primary" 
      :autoLoading="true"
      :enableConfirm="true"
      :popConfig="resetConfirmConfig"
      @click="handleReset"
    >
      重置系统
    </ProButton>
  </div>
</template>

<script setup>
import { ProButton } from '@ace-admin/ui'
import { message } from 'ant-design-vue'

const resetConfirmConfig = {
  title: '系统重置确认',
  description: '此操作将重置整个系统，所有数据将被清空，是否继续？',
  okText: '确定重置',
  cancelText: '取消',
  okType: 'danger'
}

const handleReset = async () => {
  // 模拟系统重置
  await new Promise((resolve) => setTimeout(resolve, 3000))
  message.success('系统重置完成')
}
</script>

<style scoped>
div {
  display: flex;
  gap: 8px;
}
</style>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autoLoading | 是否自动显示加载状态，当点击事件返回 Promise 时有效 | boolean | false |
| enableConfirm | 是否显示确认弹窗 | boolean | false |
| popConfig | 确认弹窗配置，详见 [Popconfirm Props](https://www.antdv.com/components/popconfirm#api) | PopconfirmProps | `{ title: '提示', description: '确定删除吗？', okText: '确定', cancelText: '取消' }` |
| onClick | 点击事件回调，支持返回 Promise | (event: Event, done?: () => void) => void \| Promise<any> | - |

### 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | 回调参数类型 |
| click | 点击按钮时触发 | (event: Event) => void |

### 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 按钮内容 |
| icon | 按钮图标 |

### 继承属性

ProButton 继承了 Ant Design Vue Button 组件的所有属性，如 type、size、disabled、loading 等，详见 [Button API](https://www.antdv.com/components/button#api)。