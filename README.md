<div align="center">
  <img alt="Ace Admin" width="120" height="120" src="src/assets/images/logo.svg">
  <h1>Ace Admin</h1>
  <span> 中文 | <a href="./README-en.md">English</a></span>
</div>

## ⚡ 简介

> Ace Admin 目标是搭建一套免费开源的中后台管理系统，基于最新且最前沿的技术，无复杂封装、结构清晰、代码优雅、功能丰富、开箱即用，让你快速搭建一个精美的中后台管理系统。

Ace Admin 是一个基于 Vue3.5、TypeScript5.x、Antd-Vue4.x、Pinia2.x 及 Vite5.x 等前沿技术栈构建的免费开源中后台管理系统解决方案(后端服务通过`Springboot3 + Java17 `实现。)。在 Antd4 精美的主题基础上，我构建了一个清晰且高效的项目逻辑架构，整合了最新的技术框架。欢迎大家使用！

## 📚 文档与预览

- 📖 **使用文档**: [在线文档](https://codexlin.github.io/vue-ace-admin/)
- 👀 **在线预览**: [Demo](https://vue-ace-admin.vercel.app/) (账号: `xoxosos666@gmail.com` / 密码: `admin666`)

## 🏗️ Monorepo 架构

Ace Admin 采用 **Monorepo** 架构设计，使用 `pnpm workspace` 管理多个包，实现代码共享和统一构建。

### 📦 项目结构

```
vue-ace-admin/
├── packages/
│   ├── hooks/          # @codexlin/ace-admin-hooks - 纯逻辑 Hooks 包
│   │   ├── src/
│   │   │   ├── useList.ts         # 列表数据管理 Hook
│   │   │   ├── usePagination.ts   # 分页管理 Hook
│   │   │   ├── useDebouncedRef.ts # 防抖 Ref Hook
│   │   │   └── ...
│   │   └── package.json
│   │
│   └── ui/             # @codexlin/ace-admin-ui - UI 组件库
│       ├── src/
│       │   ├── pro-table/         # ProTable 组件
│       │   ├── pro-button/        # ProButton 组件
│       │   ├── pro-search-form/   # ProSearchForm 组件
│       │   ├── hooks/             # UI 相关的 Hooks
│       │   └── ...
│       └── package.json
│
├── src/                # 主应用代码
├── docs/               # 文档站点
└── package.json        # 根 package.json (workspace 配置)
```

### 🎯 Monorepo 的优势

1. **代码共享**：Hooks 和 UI 组件可以在多个项目间共享
2. **统一工具链**：共享 ESLint、Prettier、TypeScript 配置
3. **原子化发布**：可以独立发布 `@codexlin/ace-admin-hooks` 和 `@codexlin/ace-admin-ui` 包
4. **类型安全**：通过 TypeScript 项目引用实现跨包类型检查
5. **开发效率**：本地开发时直接使用 workspace 包，无需发布到 npm

### 📚 包说明

#### `@codexlin/ace-admin-hooks` - 纯逻辑 Hooks 包

提供无业务依赖的通用 Hooks，可在任何 Vue 3 项目中使用：

- `useList` - 列表数据管理（支持分页、筛选、自动刷新）
- `usePagination` - 分页管理
- `useDebouncedRef` - 防抖 Ref
- `useLoading` - 加载状态管理
- 更多...

#### `@codexlin/ace-admin-ui` - UI 组件库

基于 Ant Design Vue 的增强组件库，提供企业级 UI 组件：

- `ProTable` - 增强表格组件（支持斑马纹、工具栏等）
- `ProButton` - 增强按钮组件（支持自动加载、确认弹窗）
- `ProSearchForm` - 搜索表单组件
- `useList` - UI 版本的 useList（集成 Ant Design Vue 消息提示）
- 更多...

### 🚀 开发方式

#### 本地开发

在本地开发时，直接使用 workspace 包，无需发布到 npm：

```typescript
// 主应用直接使用 workspace 包
import { useList, ProTable } from '@codexlin/ace-admin-ui'
```

#### 发布到 npm

如果需要在其他项目中使用，可以发布到 npm：

```bash
# 发布 hooks 包
cd packages/hooks
pnpm publish

# 发布 ui 包
cd packages/ui
pnpm publish
```

### 🔧 构建命令

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


## ❤️ 用爱发电

- **完全免费**：但希望你点一个 star⭐ ！！！
- **非常简洁**：没有复杂的封装，没有复杂的类型体操，开箱即用
- **详细的注释**：各个配置项都写有尽可能详细的注释
- **最新的依赖**: 定期更新所有三方依赖至最新版
- **有一点规整**: 代码风格统一，命名风格统一，注释风格统一

## 📖 项目亮点

- **前沿技术**：Vue 3.5 最新周边生态。
- **Simple git hooks**：尤大推荐(可代替husky)。
- **Antd-Vue**：使用更精美的Ant-Design-Vue 4.x 版本。
- **Pinia**: 传说中的 Vuex5 , 已集成 Pinia 持久化插件。
- **Vite**：最新的 Vite5.x ,以快速著称的现代化构建工具(多环境)。
- **Vue Router**：Vue Router 管理路由。
- **TypeScript**：超越传统 JavaScript 语言的静态类型方案。
- **Pnpm**：快速且节省空间的包管理工具。
- **Scss**：用于定制布局和颜色风格。
- **ESLint9 & Prettier**：代码校验与格式化工具。
- **Axios**：网络请求库（优雅封装）。
- **兼容移动端**: 布局兼容移动端页面分辨率(开发中)。

## 📔 功能特色

- [x] **用户管理**：登录、登出演示
- [x] **RBAC权限管理**：内置页面权限（动态路由）、路由守卫、指令权限、权限函数(coding)
- [x] **Hooks**：常用hooks封装
- [x] **多环境**：多环境支持，适配开发、预发布和生产环境。
- [x] **多主题**：内置普通、黑暗、自定义主题模式以及丰富的主题定制功能。
- [x] **多布局**：内置左侧、顶部布局模式。
- [x] **错误页面**: 错误处理页面，如403、404。
- [x] **Dashboard**：根据用户角色定制化显示。
- [x] **图标**：支持 SVG组件、Iconfont、Iconify。
- [x] **其他内置功能**：如Ai集成、TinyMCE编辑器、动态侧边栏、动态面包屑、标签页快捷导航、 全屏、自适应收缩侧边栏等

## 🚀 使用指南

### 使用前配置

1. 环境准备
2. node 版本推荐 20.x
3. pnpm 版本推荐 10.x+ (项目使用 pnpm@10.14.0)

```shell
# 克隆项目
git clone https://github.com/codexlin/vue-ace-admin.git
```

```shell
# 进入项目目录
cd vue-ace-admin
```

```shell
# 安装 pnpm (如已安装可跳过)
npm install pnpm -g
```

```shell
# 安装依赖
pnpm i
```

```shell
# 启动服务
pnpm dev
```

## 🔧 代码检查

```shell
# 代码检查与格式化，只需执行相应的命令。
pnpm lint
```

## ✔️ 预览

```shell
# 预览正式环境
pnpm preview
```

## 📦️ 多环境打包

```shell
# 构建预发布环境
pnpm build:test
```

```shell
# 构建正式环境
pnpm build:prod
```
## 如何参与贡献

我们非常欢迎您参与我们的开源项目！

**提交 Pull Request:**

1. Fork代码仓库
2. 创建您的功能分支：`git checkout -b feat-xxxx`
3. 提交代码变更：`git commit -am 'feat(功能): 新增xxxx功能'`
4. 推送分支到远程仓库：`git push origin feat-xxxx`
5. 提交 Pull Request


## ✒️ Git 提交规范参考

Git 提交规范，包含了常见的提交类型，方便开发者追踪和管理变更。内置cz-git, 可直接在终端使用git cz进行交互式提交。

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md)
  规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中

## 🖥️ 项目预览图

  [点击查看预览](https://cdn.jsdelivr.net/gh/codexlin/jsDelivr/assets/test.gif)

## 🌏 浏览器支持

本地开发推荐使用现代浏览器`Chrome 80+` 浏览器

不支持 IE

## 💕 感谢 Star

若您喜欢这个项目，请不吝赐予 ⭐star 支持，这是维护者持续更新的动力。（小声：毕竟是免费的）

## 📄 License

本项目采用 [MIT](./LICENSE) 许可协议，版权归 [CodexLin](https://github.com/codexlin)所有。

Copyright (c) 2023-Present [CodexLin](https://github.com/codexlin)
