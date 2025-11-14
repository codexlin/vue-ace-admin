<div align="center">
  <img alt="Ace Admin" width="120" height="120" src="src/assets/images/logo.svg">
  <h1>Ace Admin</h1>
  <span><a href="./README.md">中文</a> | English </span>
</div>

## ⚡ Introduction

> Ace Admin aims to build a free and open-source mid-small size backend management system, based on the latest Vue3.5 ecosystem and other mainstream technologies. Ready to use out of the box, no complex packaging, supports secondary development. (Currently writing Java backend, other language versions may be written later.)

Ace Admin is a free and open-source backend management system solution built using cutting-edge technology stacks like Vue3.5, TypeScript5.x, Antd-Vue4.x, Pinia2.x, and Vite5.x. The project data is implemented via ApiFox simulation. Based on the exquisite theme of Antd4, I have constructed a clear and efficient project logic structure, integrating the latest technology frameworks. Welcome to use!

## 🏗️ Monorepo Architecture

Ace Admin uses a **Monorepo** architecture design, managed with `pnpm workspace` to enable code sharing and unified builds across multiple packages.

### 📦 Project Structure

```
vue-ace-admin/
├── packages/
│   ├── hooks/          # @ace-admin/hooks - Pure logic Hooks package
│   │   ├── src/
│   │   │   ├── useList.ts         # List data management Hook
│   │   │   ├── usePagination.ts   # Pagination management Hook
│   │   │   ├── useDebouncedRef.ts # Debounced Ref Hook
│   │   │   └── ...
│   │   └── package.json
│   │
│   └── ui/             # @ace-admin/ui - UI component library
│       ├── src/
│       │   ├── pro-table/         # ProTable component
│       │   ├── pro-button/        # ProButton component
│       │   ├── pro-search-form/   # ProSearchForm component
│       │   ├── hooks/             # UI-related Hooks
│       │   └── ...
│       └── package.json
│
├── src/                # Main application code
├── docs/               # Documentation site
└── package.json        # Root package.json (workspace config)
```

### 🎯 Benefits of Monorepo

1. **Code Sharing**: Hooks and UI components can be shared across multiple projects
2. **Unified Toolchain**: Shared ESLint, Prettier, TypeScript configurations
3. **Atomic Publishing**: Can independently publish `@ace-admin/hooks` and `@ace-admin/ui` packages
4. **Type Safety**: Cross-package type checking through TypeScript project references
5. **Development Efficiency**: Direct use of workspace packages in local development without npm publishing

### 📚 Package Overview

#### `@ace-admin/hooks` - Pure Logic Hooks Package

Provides generic Hooks with no business dependencies, usable in any Vue 3 project:

- `useList` - List data management (supports pagination, filtering, auto-refresh)
- `usePagination` - Pagination management
- `useDebouncedRef` - Debounced Ref
- `useLoading` - Loading state management
- And more...

#### `@ace-admin/ui` - UI Component Library

Enhanced component library based on Ant Design Vue, providing enterprise-grade UI components:

- `ProTable` - Enhanced table component (supports zebra striping, toolbar, etc.)
- `ProButton` - Enhanced button component (supports auto-loading, confirmation popup)
- `ProSearchForm` - Search form component
- `useList` - UI version of useList (integrated with Ant Design Vue message notifications)
- And more...

### 🚀 Development Workflow

#### Local Development

When developing locally, directly use workspace packages without publishing to npm:

```typescript
// Main application directly uses workspace packages
import { useList, ProTable } from '@ace-admin/ui'
```

#### Publishing to npm

If you need to use in other projects, you can publish to npm:

```bash
# Publish hooks package
cd packages/hooks
pnpm publish

# Publish ui package
cd packages/ui
pnpm publish
```

### 🔧 Build Commands

```bash
# Build all packages
pnpm build

# Build hooks package
pnpm build:hooks

# Build ui package
pnpm build:ui

# Develop ui package
pnpm dev:ui
```

## 📚 Documentation

- User Documentation: [doc](https://ace-admin-doc.vercel.app/)

## 📺 Online Demo

| Location | Account              | Password | Link                                                                 |
| -------- | -------------------- | -------- | -------------------------------------------------------------------- |
| vercel   | xoxosos666@gmail.com | admin666 | <a href="https://vue-ace-admin.vercel.app/" target="_blank">Link</a> |

## ❤️ Powered by Love

- **Completely Free**: But I hope you give a star ⭐!!!
- **Very Simple**: No complex packaging, no complex type gymnastics, ready to use out of the box
- **Detailed Comments**: As detailed comments as possible for each configuration item
- **Latest Dependencies**: Regular updates of all third-party dependencies to the latest version
- **A Bit of Regularity**: Unified code style, naming style, and comment style

## 📖 Project Highlights

- **Cutting-edge Technology**: The latest around Vue 3.4 ecosystem.
- **Simple git hooks**: Recommended by Evan You (can replace husky).
- **Antd-Vue**: Using the more exquisite Ant-Design-Vue 4.x version.
- **Pinia**: The legendary Vuex5, integrated with Pinia persistence plugin.
- **Vite**: The latest Vite5.x, a modern build tool known for its speed (multi-environment).
- **Vue Router**: Manages routes.
- **TypeScript**: A static type scheme that goes beyond traditional JavaScript.
- **Pnpm**: A fast and space-saving package management tool.
- **Scss**: Used to customize layouts and color styles.
- **ESLint & Prettier**: Code verification and formatting tools.
- **Axios**: Networking library (elegantly encapsulated).
- **Mobile Compatibility**: Layout compatible with mobile page resolutions (under development).

## 📔 Features

- [x] **User Management**: Login, logout demonstration
- [x] **Permission Management**: Built-in page permissions (dynamic routes), route guards, directive permissions, permission functions (coding)
- [x] **Hooks**: Commonly used hooks encapsulation
- [x] **Multi-environment**: Support for development, pre-release, and production environments.
- [x] **Multiple Themes**: Built-in normal, dark, and custom theme modes.
- [x] **Multiple Layouts**: Built-in left-side, top-side layout modes.
- [x] **Error Pages**: Error handling pages, such as 403, 404.
- [x] **Dashboard**: Customized display based on user roles.
- [x] **Other Built-in Features**: Such as SVG, dynamic sidebar, dynamic breadcrumbs, tabbed navigation, Screenfull full screen, responsive sidebar, etc.

## 🚀 Usage Guide

### Pre-configuration

1. Environment Setup
2. Recommended node version 20.x
3. Recommended pnpm version 10.x+ (Project uses pnpm@10.14.0)

```shell
# Clone the project
git clone https://github.com/codexlin/vue-ace-admin.git
```


```shell
# Enter the project directory
cd vue-ace-admin
```

```shell
# Install pnpm (skip if already installed)
npm install pnpm -g
```

```shell
# Install dependencies
pnpm i
```

```shell
# Start the service
pnpm dev
```

## 🔧 Code Checking

```shell
# Code check and formatting, just run the corresponding command.
pnpm lint
```

## ✔️ Preview

```shell
# Preview the production environment
pnpm preview
```

## 📦️ Multi-environment Packaging

```shell
# Build for pre-release environment
pnpm build:test
```
```shell
# Build for production environment
pnpm build:prod
```
## Contribute

We are very welcome to have you participate in our open source project.


**Pull Request:**

1. Fork code!
2. Create your own branch: `git checkout -b feat-xxxx`
3. Submit your changes: `git commit -am 'feat(function): add xxxxx'`
4. Push your branch: `git push origin feat-xxxx`
5. submit`pull request`

Thank you to all the people who already contributed to ace-admin!

<a href="https://github.com/codexlin/vue-ace-admin/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=codexlin/vue-ace-admin&max=100&columns=15" />
</a>

## ✒️ Git Commit Conventions Reference

Git commit conventions include common commit types that help developers track and manage changes more effectively.

- Refer to [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md)
  conventions ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` for new features
  - `fix` for bug fixes
  - `style` for code style related changes (no impact on code operation)
  - `perf` for performance improvements
  - `refactor` for refactorings
  - `revert` for reverting changes
  - `test` for tests
  - `docs` for documentation and comments
  - `chore` for maintenance tasks
  - `workflow` for workflow improvements
  - `ci` for continuous integration
  - `types` for type definition changes
  - `wip` for work in progress

## 🖥️ Project Preview Image

<div>
   <img src="https://pic.imgdb.cn/item/654b506fc458853aef84d579.jpg" alt="blob">
</div>

## 🌏 Browser Support

For local development, modern browsers such as `Chrome 80+` are recommended.

IE is not supported.

## 💕 Thanks for the Star

If you like this project, please don’t hesitate to give a ⭐star as a token of appreciation. This motivates the maintainer to continue updating. (Whispering: after all, it's free)

## 📄 License

This project is licensed under the [MIT](./LICENSE) License. Copyright belongs to [CodexLin](https://github.com/codexlin).

Copyright (c) 2023-Present [CodexLin](https://github.com/codexlin)
