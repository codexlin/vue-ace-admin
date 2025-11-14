# 介绍

Ace Admin 采用 **Monorepo** 架构设计，使用 `pnpm workspace` 管理多个包，实现代码共享和统一构建。

## 📦 项目结构

```
vue-ace-admin/
├── packages/
│   ├── hooks/          # @ace-admin/hooks - 纯逻辑 Hooks 包
│   │   └── src/
│   │       ├── useList.ts         # 列表数据管理 Hook
│   │       ├── usePagination.ts   # 分页管理 Hook
│   │       ├── useDebouncedRef.ts # 防抖 Ref Hook
│   │       └── ...
│   │
│   └── ui/             # @ace-admin/ui - UI 组件库
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

## 🎯 Monorepo 的优势

1. **代码共享**：Hooks 和 UI 组件可以在多个项目间共享
2. **统一工具链**：共享 ESLint、Prettier、TypeScript 配置
3. **原子化发布**：可以独立发布 `@ace-admin/hooks` 和 `@ace-admin/ui` 包
4. **类型安全**：通过 TypeScript 项目引用实现跨包类型检查
5. **开发效率**：本地开发时直接使用 workspace 包，无需发布到 npm

## 📚 包说明

### `@ace-admin/hooks` - 纯逻辑 Hooks 包

提供无业务依赖的通用 Hooks，可在任何 Vue 3 项目中使用：

- `useList` - 列表数据管理（支持分页、筛选、自动刷新）
- `usePagination` - 分页管理
- `useDebouncedRef` - 防抖 Ref
- `useLoading` - 加载状态管理
- 更多...

### `@ace-admin/ui` - UI 组件库

基于 Ant Design Vue 的增强组件库，提供企业级 UI 组件：

- `ProTable` - 增强表格组件（支持斑马纹、工具栏等）
- `ProButton` - 增强按钮组件（支持自动加载、确认弹窗）
- `ProSearchForm` - 搜索表单组件
- `useList` - UI 版本的 useList（集成 Ant Design Vue 消息提示）
- 更多...

## 🚀 开发方式

### 本地开发

在本地开发时，直接使用 workspace 包，无需发布到 npm：

```typescript
// 主应用直接使用 workspace 包
import { useList, ProTable } from '@ace-admin/ui'
```

### 发布到 npm

如果需要在其他项目中使用，可以发布到 npm：

```bash
# 发布 hooks 包
cd packages/hooks
pnpm publish

# 发布 ui 包
cd packages/ui
pnpm publish
```

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






