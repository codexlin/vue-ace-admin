---
title: ProButton 按钮
description: 增强版按钮组件，支持自动加载和确认弹窗功能
---

# ProButton 按钮

ProButton 是基于 Ant Design Vue 的 Button 组件扩展的增强版按钮，提供了自动加载和确认弹窗等额外功能。
它完全兼容原生 `<a-button>` 的所有属性、事件和插槽，并新增了如下扩展属性：

- `autoLoading`：自动切换 loading 状态，适用于异步操作。
- `enableConfirm`：点击前弹出确认弹窗，防止误操作。
- `popConfig`：自定义确认弹窗内容和按钮文本。
- `onClick`：支持异步回调，自动处理 loading 状态。

---

## 代码示例

### 基础用法

:::demo

```vue
<template>
  <div>
    <ProButton type="primary" :loading="true">主要按钮</ProButton>
    <ProButton type="default">默认按钮</ProButton>
    <ProButton type="dashed">虚线按钮</ProButton>
    <ProButton type="link">链接按钮</ProButton>
    <ProButton type="text">文本按钮</ProButton>
  </div>
</template>

<script setup>
import { ProButton } from '@codexlin/ace-admin-ui'
</script>

<style scoped>
div {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
```
:::

---

### 自动加载（autoLoading）

点击按钮时自动显示 loading 状态，异步操作完成后自动恢复。

:::demo

```vue
<template>
  <a-space>
    <ProButton type="primary" autoLoading :onClick="handleSaveData">
      保存数据（真实API）
    </ProButton>
    <ProButton type="default" autoLoading :onClick="handleSimulateAsync">
      模拟异步操作
    </ProButton>
  </a-space>
</template>

<script setup>
import { ProButton, message } from '@codexlin/ace-admin-ui'

async function handleSaveData() {
  // 真实 API 请求
  const res = await fetch('https://m1.apifoxmock.com/m1/2120640-3081152-2c46b26a/saveData?apifoxToken=dROD5webTSINtKEixUxWWBYNnjoRsSXn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: 'test' })
  })
  const json = await res.json()
  message(json.message || '保存成功')
}

function handleSimulateAsync() {
  return new Promise(resolve => {
    setTimeout(() => {
      message('模拟操作完成')
      resolve()
    }, 2000)
  })
}
</script>
```
:::

---

### 确认弹窗（enableConfirm）

危险操作前弹出确认框，防止误操作。

:::demo

```vue
<template>
  <a-space>
    <ProButton
      type="primary"
      danger
      enableConfirm
      autoLoading
      :popConfig="{
        title: '删除确认',
        description: '确定要删除这条数据吗？此操作不可恢复！',
        okText: '确定删除',
        cancelText: '取消'
      }"
      :onClick="handleDelete"
    >
      删除数据
    </ProButton>

    <ProButton
      enableConfirm
      autoLoading
      :popConfig="{
        title: '重置确认',
        description: '确定要重置所有配置吗？'
      }"
      :onClick="handleReset"
    >
      重置配置
    </ProButton>
  </a-space>
</template>

<script setup>
import { ProButton, message } from '@codexlin/ace-admin-ui'

async function handleDelete() {
  // 模拟删除 API
  await new Promise(resolve => setTimeout(resolve, 1500))
  message('✅ 删除成功')
}

async function handleReset() {
  // 模拟重置 API
  await new Promise(resolve => setTimeout(resolve, 1000))
  message('✅ 配置已重置')
}
</script>
```
:::

---

### 插槽用法

:::demo

```vue
<template>
  <ProButton type="primary">
    <template #icon><PoweroffOutlined /></template>
    编辑
  </ProButton>
</template>

<script setup>
import { ProButton } from '@codexlin/ace-admin-ui'
import { PoweroffOutlined } from '@ant-design/icons-vue';
</script>
```
:::

---

## Props

| 属性名         | 类型                | 默认值   | 说明                       |
| -------------- | ------------------- | -------- | -------------------------- |
| `autoLoading`  | `boolean`           | `false`  | 是否在异步操作时自动切换按钮的 loading 状态。 |
| `enableConfirm`| `boolean`           | `false`  | 是否在点击按钮前弹出确认弹窗。 |
| `popConfig`    | `object \| () => object` | 见下方 | 确认弹窗的配置项，支持对象或返回对象的函数。 |
| `onClick`      | `(e: MouseEvent) => void \| Promise<any>` | - | 按钮点击事件回调，支持异步函数，自动处理 loading。 |
| 其他属性       | 同 [a-button](https://www.antdv.com/components/button) | - | 支持所有原生 a-button 的属性、事件和插槽。 |

> 💡 ProButton 也兼容 `v-bind`，可以事先构建一个对象统一控制 antd 原生 props 与扩展能力：
>
> ```vue
> <script setup>
> import { reactive } from 'vue'
>
> const buttonOptions = reactive({
>   type: 'primary',
>   danger: true,
>   autoLoading: true,
>   enableConfirm: true
> })
> </script>
>
> <template>
>   <ProButton v-bind="buttonOptions">删除</ProButton>
> </template>
> ```

### `popConfig` 默认值

```js
{
  title: '提示',
  description: '确定删除吗？',
  okText: '确定',
  cancelText: '取消'
}
```

---

## Slots

| 插槽名    | 说明                       |
| --------- | -------------------------- |
| `default` | 按钮内容                   |
| 其他插槽  | 同原生 a-button，支持全部插槽 |

---

## Events

| 事件名    | 说明                       |
| --------- | -------------------------- |
| `onClick` | 按钮点击事件，支持异步回调 |

---

## 说明

- `autoLoading` 仅在 `onClick` 返回 Promise 时生效，自动切换 loading 状态。
- `enableConfirm` 为 `true` 时，按钮会被确认弹窗包裹，需用户确认后才会触发点击事件。
- `popConfig` 支持所有 [a-popconfirm](https://www.antdv.com/components/popconfirm) 的配置项。
- 组件完全兼容原生 [a-button](https://www.antdv.com/components/button)  的所有属性和插槽。

---

如需更多用法或扩展场景，欢迎继续提问！
