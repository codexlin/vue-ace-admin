# Vue Ace Admin 组件库说明

Vue Ace Admin 组件库是一套基于 Vue 3 和 Ant Design Vue 的企业级组件库，帮助开发者高效构建现代化管理系统和后台应用。

---

## 快速开始

### 安装

Vue Ace Admin 组件库依赖 [Vue 3](https://vuejs.org/) 和 [Ant Design Vue](https://www.antdv.com/)。在使用本组件库前，请确保已安装并正确配置这两个依赖。

```bash
pnpm install vue ant-design-vue @codexlin/ace-admin-ui
```

> ⚠️ 使用前必须安装并正确注册 `ant-design-vue` 和 `vue`，否则组件无法正常工作。

### 在项目中使用

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import '@codexlin/ace-admin-ui/dist/ace-admin-ui.css'

const app = createApp(App)
app.use(Antd)
// 你的其他全局配置...
app.mount('#app')
```

---

## 按需引入

Vue Ace Admin 组件库支持按需引入组件，无需全量注册，可以只导入和使用你需要的组件，从而减小打包体积。

### 按需引入示例

```vue
<script setup>
import { ProButton } from '@codexlin/ace-admin-ui'
// 只引入 ProButton，不会引入其他组件
</script>

<template>
  <ProButton type="primary">主要按钮</ProButton>
</template>
```

你也可以在同一个文件中只引入所需的多个组件：

```vue
<script setup>
import { ProButton, ProTable } from '@codexlin/ace-admin-ui'
</script>

<template>
  <ProButton type="primary">主要按钮</ProButton>
  <ProTable :columns="columns" :dataSource="data" />
</template>
```

### 按需引入的优势

- **减小包体积**：只打包实际用到的组件
- **提升性能**：减少无用代码加载
- **灵活扩展**：可自由组合所需组件

> 按需引入无需额外配置，直接通过 ES Module 语法导入即可。


### 在 SFC/Playground 中使用

如果你在 [Vue SFC Playground](https://play.vuejs.org/) 或类似在线编辑器中体验组件库：

1. 在 Import Map 添加：
   ```json
   {
     "imports": {
       "@codexlin/ace-admin-ui": "https://unpkg.com/@codexlin/ace-admin-ui/dist/ace-admin-ui.es.js",
       "ant-design-vue": "https://unpkg.com/ant-design-vue/dist/ant-design-vue.esm.js"
     }
   }
   ```
2. 在 HTML/CSS tab 或 `<style>` 中引入样式：
   ```html
   <link rel="stylesheet" href="https://unpkg.com/ant-design-vue/dist/antd.css">
   <link rel="stylesheet" href="https://unpkg.com/@codexlin/ace-admin-ui/dist/ace-admin-ui.css">
   ```
3. 在 SFC 中直接使用组件：
   ```vue
   <script setup>
   import { ProButton } from '@codexlin/ace-admin-ui'
   </script>
   <template>
     <ProButton type="primary">主要按钮</ProButton>
   </template>
   ```

**前提：**
- 项目需安装并正确注册 `ant-design-vue`
- 样式需全局引入
- CDN/Import Map 路径需指向 ES Module 构建版本

---

## 组件一览

### 基础组件

- **ProButton 按钮**
  多类型、多状态、自动 loading、确认弹窗，完全兼容原生 a-button 属性和插槽。
- **ProTable 表格**
  支持斑马纹、卡片包装、工具栏插槽，继承 Ant Design Vue Table 全部功能。

---

## 设计理念

- **一致性**：统一设计规范，风格高度一致
- **易用性**：API 简洁，文档完善
- **可扩展性**：支持主题定制和样式覆盖
- **无障碍性**：支持键盘导航和屏幕阅读器

---

## 最佳实践

- 按需引入组件，减少包体积
- 全局注册依赖库（如 Ant Design Vue）
- 遵循设计规范，保持一致性
- 合理布局与响应式设计

---

## 贡献与反馈

- 克隆项目并安装依赖：`pnpm install`
- 启动开发环境：`pnpm run dev`
- 通过 GitHub Issues 反馈问题，建议附上详细描述和复现步骤

---

## 更新日志

### v1.0.0
- 发布基础组件：ProButton、ProTable
- 支持主题定制与无障碍访问

---

如需详细组件用法、API 说明，请查阅对应组件文档。
