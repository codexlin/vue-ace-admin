<div align="center">
  <img alt="Ace Admin" width="120" height="120" src="src/assets/images/logo.svg">
  <h1>Ace Admin</h1>
  <span><a href="./README.md">中文</a> | English</span>
</div>

## ⚡ 简介

> Ace(无需多言-.-) 目标搭建一个免费开源的中小型后台管理系统, 基于最新 Vue3.4 全家桶生态等主流技术.(: 开箱即用、无复杂封装、支持二次开发. (后续会写一套后台包括但不限于Java或Go或Node)

Ace Admin 是一个基于 Vue3.4、TypeScript5.x、Antd-Vue4.x、Pinia2.x 及 Vite5.x 等前沿技术栈构建的免费开源中后台管理系统解决方案。项目数据通过 ApiFox 模拟实现。在 Antd4 精美的主题基础上，我构建了一个清晰且高效的项目逻辑架构，整合了最新的技术框架。欢迎大家使用！

## 📚 文档

- 使用文档：[doc](https://ace-admin-doc.vercel.app/)

## 📺 在线预览

| 位置   | 账号                        | 链接                                                                 |
| ------ | --------------------------- | -------------------------------------------------------------------- |
| vercel | admin@qq.com 或 user@qq.com | <a href="https://vue-ace-admin.vercel.app/" target="_blank">链接</a> |

## ❤️ 用爱发电

- **完全免费**：但希望你点一个 star⭐ ！！！
- **非常简洁**：没有复杂的封装，没有复杂的类型体操，开箱即用
- **详细的注释**：各个配置项都写有尽可能详细的注释
- **最新的依赖**: 定期更新所有三方依赖至最新版
- **有一点规整**: 代码风格统一，命名风格统一，注释风格统一

## 📖 项目亮点

- **前沿技术**：Vue 3.4 最新周边以及 scrpit setup 。
- **Simple git hooks**：尤大都在用(可代替husky)。
- **Antd Vue**：使用更精美的Ant-Design-Vue 4.x 版本。
- **Pinia**: 传说中的 Vuex5 , 已集成 Pinia 持久化插件。
- **Vite**：以快速著称的现代化构建工具(多环境)。
- **Vue Router**：Vue Router 管理路由。
- **TypeScript**：超越传统 JavaScript 语言的静态类型方案。
- **Pnpm**：快速且节省空间的包管理工具。
- **Scss**：用于定制布局和颜色风格。
- **ESLint & Prettier**：代码校验与格式化工具。
- **Axios**：网络请求库（优雅封装）。
- **兼容移动端**: 布局兼容移动端页面分辨率(开发中)。

## 📔 功能特色

- [x] **用户管理**：登录、登出演示
- [ ] **权限管理**：内置页面权限（动态路由）、路由守卫、指令权限、权限函数(coding)
- [x] **Hooks**：常用hooks封装
- [x] **多环境**：多环境支持,适配开发、预发布和生产环境。
- [x] **多主题**：内置普通、黑暗、自定义主题模式。
- [ ] **多布局**：内置左侧、顶部、混合三种布局模式(开发中)。
- [x] **错误页面**: 错误处理页面，如403、404。
- [x] **Dashboard**：根据用户角色定制化显示。
- [x] **其他内置功能**：如SVG、动态侧边栏、动态面包屑、标签页快捷导航、Screenfull 全屏、自适应收缩侧边栏等

## 🚀 使用指南

### 使用前配置

1. 环境准备
2. node 版本推荐 18+/20+
3. pnpm 版本推荐 8.x+

```js
# 克隆项目
git clone https://github.com/xoxosos/vue-ace-admin.git
```

```js
# 进入项目目录
cd vue-ace-admin
```

```js
# 安装 pnpm (如已安装可跳过)
npm install pnpm -g
```

```js
# 安装依赖
pnpm i
```

```js
# 启动服务
pnpm dev
```

## 🔧 代码检查

```shell
# 代码检查与格式化，只需执行相应的命令。
pnpm lint
```

## ✔️ 预览

```js
# 预览预发布环境
pnpm preview:stage

# 预览正式环境
pnpm preview:prod
```

## 📦️ 多环境打包

```bash
# 构建预发布环境
pnpm build:stage

# 构建正式环境
pnpm build:prod
```

## ✒️ Git 提交规范参考

Git 提交规范，包含了常见的提交类型，方便开发者追踪和管理变更。

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

<div>
   <img src="https://pic.imgdb.cn/item/654b506fc458853aef84d579.jpg" alt="blob">
</div>

## 🌏 浏览器支持

本地开发推荐使用`Chrome 80+` 浏览器

支持现代浏览器, 不支持 IE

## 💕 感谢 Star

若您喜欢这个项目，请不吝赐予 ⭐star 支持，这是维护者持续更新的动力。（小声：毕竟是免费的）

## 📄 License

本项目采用 [MIT](./LICENSE) 许可协议，版权归 [AceLin](https://github.com/xoxosos)所有。

Copyright (c) 2023-present [AceLin](https://github.com/xoxosos)
