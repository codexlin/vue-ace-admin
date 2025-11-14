# 介绍

## 🎯 为什么选择 Vue Ace Admin？

还在为搭建中后台管理系统而烦恼吗？

- ❌ 从零搭建太耗时，重复造轮子？
- ❌ 权限管理复杂，不知道如何实现？
- ❌ 组件库功能不够，需要自己封装？
- ❌ 代码结构混乱，维护困难？

**Vue Ace Admin 帮你解决所有问题！**

### ✨ 核心优势

1. **5分钟快速上手** - 克隆即用，完整的管理系统开箱即用
2. **Monorepo 架构** - 主应用、组件库、Hooks 包统一管理，代码共享
3. **组件库可独立使用** - 可在其他项目中单独使用组件库
4. **完整的权限体系** - RBAC 权限管理，开箱即用
5. **最新技术栈** - Vue 3.5 + TypeScript 5.x + Vite 5.x
6. **无复杂封装** - 代码清晰，学习成本低

## 📦 项目定位

Vue Ace Admin 是一个**完整的中后台管理系统解决方案**，采用 **Monorepo** 架构设计。

### 两种使用方式

#### 1. 完整的主应用（推荐新手）

**适合场景：**
- 需要快速搭建管理系统
- 需要完整的权限管理
- 需要开箱即用的功能

**包含功能：**
- ✅ 用户管理、角色管理、菜单管理
- ✅ RBAC 权限管理体系
- ✅ 多主题、多布局支持
- ✅ Dashboard 数据展示
- ✅ 完整的路由和状态管理

#### 2. 独立的组件库和 Hooks（推荐有经验开发者）

**适合场景：**
- 已有项目，只需要组件
- 想学习组件封装
- 需要可复用的 Hooks

**包含内容：**
- 📦 `@codexlin/ace-admin-ui` - 业务组件库
- 🎣 `@codexlin/ace-admin-hooks` - 通用 Hooks 包
- ✅ 可在任何 Vue 3 项目中使用
- ✅ 完整的 TypeScript 类型支持

## 📦 项目结构

```
vue-ace-admin/
├── packages/
│   ├── hooks/          # @codexlin/ace-admin-hooks - 纯逻辑 Hooks 包
│   │   └── src/
│   │       ├── useList.ts         # 列表数据管理 Hook
│   │       ├── usePagination.ts   # 分页管理 Hook
│   │       ├── useDebouncedRef.ts # 防抖 Ref Hook
│   │       └── ...
│   │
│   └── ui/             # @codexlin/ace-admin-ui - UI 组件库
│       └── src/
│           ├── pro-table/         # ProTable 组件
│           ├── pro-button/        # ProButton 组件
│           ├── pro-search-form/   # ProSearchForm 组件
│           ├── hooks/             # UI 相关的 Hooks
│           └── ...
│
├── src/                # 主应用代码
├── docs/               # 文档站点（VitePress）
└── package.json        # 根 package.json (workspace 配置)
```

## 🏗️ Monorepo 架构 - 项目的核心亮点

Vue Ace Admin 采用 Monorepo 架构，这是项目的**核心亮点**之一，让你同时拥有：

### 🎯 一套代码，两种用法

**方式一：完整主应用（开箱即用）**
```bash
git clone https://github.com/codexlin/vue-ace-admin.git
cd vue-ace-admin
pnpm install
pnpm dev
# 5分钟后，一个完整的管理系统就运行起来了！
```

**方式二：只使用组件库（灵活复用）**
```bash
pnpm add @codexlin/ace-admin-ui
# 在你的项目中直接使用组件，无需搭建完整系统
```

### 💡 Monorepo 带来的优势

1. **代码共享** - 主应用、组件库、Hooks 包共享代码，避免重复
2. **类型安全** - 跨包类型检查，确保类型安全，减少 90% 的类型错误
3. **开发效率** - 本地开发修改立即生效，无需发布到 npm
4. **统一管理** - 共享工具链和配置，代码风格一致
5. **灵活发布** - 可以独立发布组件库到 npm，供其他项目使用
6. **无缝切换** - 本地开发和 npm 使用方式完全一致，无需修改代码

## 📚 包说明

### `@codexlin/ace-admin-hooks` - 纯逻辑 Hooks 包

提供无业务依赖的通用 Hooks，可在任何 Vue 3 项目中使用：

- `useList` - 列表数据管理（支持分页、筛选、自动刷新）
- `usePagination` - 分页管理
- `useDebouncedRef` - 防抖 Ref
- `useLoading` - 加载状态管理
- 更多...

### `@codexlin/ace-admin-ui` - UI 组件库

基于 Ant Design Vue 的增强组件库，提供企业级 UI 组件：

- `ProTable` - 增强表格组件（支持斑马纹、工具栏等）
- `ProButton` - 增强按钮组件（支持自动加载、确认弹窗）
- `ProSearchForm` - 搜索表单组件
- `useList` - UI 版本的 useList（集成 Ant Design Vue 消息提示）
- 更多...

## 🚀 使用方式

### 本地开发（Monorepo）

在本地开发时，直接使用 workspace 包，无需发布到 npm：

**package.json 配置：**
```json
{
  "dependencies": {
    "@codexlin/ace-admin-hooks": "workspace:*",
    "@codexlin/ace-admin-ui": "workspace:*"
  }
}
```

**使用方式：**
```typescript
// 导入组件和 Hooks
import { ProTable, ProButton, useList } from '@codexlin/ace-admin-ui'
import '@codexlin/ace-admin-ui/dist/ace-admin-ui.css'
```

**优势：**
- ✅ 直接使用源码，修改立即生效
- ✅ 无需构建，开发效率高
- ✅ 完整的 TypeScript 类型支持

### npm 发布后（外部用户）

如果需要在其他项目中使用，可以发布到 npm：

**安装：**
```bash
pnpm add @codexlin/ace-admin-ui
# 或
npm install @codexlin/ace-admin-ui
# 或
yarn add @codexlin/ace-admin-ui
```

**使用方式（完全一致）：**
```typescript
// 导入组件和 Hooks（与本地开发完全一样）
import { ProTable, ProButton, useList } from '@codexlin/ace-admin-ui'
import '@codexlin/ace-admin-ui/dist/ace-admin-ui.css'
```

**优势：**
- ✅ 使用方式与本地开发完全一致
- ✅ 完整的 TypeScript 类型支持
- ✅ 构建后的优化代码

### 无缝切换

本地开发和 npm 发布后的使用方式**完全一致**，可以无缝切换：

- ✅ 相同的导入语句
- ✅ 相同的样式导入路径
- ✅ 相同的类型支持
- ✅ 相同的 API

这意味着：
- 本地开发时可以直接使用 workspace 包
- 发布到 npm 后，用户使用方式与文档示例完全一致
- 无需修改任何代码即可从本地开发切换到 npm 使用

## 🔧 构建命令

```bash
# 构建所有包
pnpm build

# 构建 hooks 包
pnpm build:hooks

# 构建 ui 包
pnpm build:ui

# 开发 ui 包
pnpm dev:ui
```






