<div align="center">
  <img alt="Ace Admin" width="120" height="120" src="./src/assets/logo.svg">
  <h1>Ace Admin</h1>
  <span><a href="./README.md">中文</a> | English</span>
</div>

## ⚡ 简介

Ace Admin 是一个基于 Vue3.3、TypeScript5.x、Antd-Vue4.x、Pinia2.x 及 Vite4.x 等前沿技术栈构建的免费开源中后台管理系统解决方案。该方案模拟数据通过 ApiFox 实现。具备常用功能模块(: 开箱即用、无复杂封装、支持二次开发.

## 📚 文档

- 多语言文档：开发ing
- 使用文档：编写ing

## 📺 在线预览

| 位置   | 账号            | 链接                                               |
| ------ | --------------- | -------------------------------------------------- |
| vercel | admin@qq.com 或 user@qq.com | <a href="https://vue-ace-admin.vercel.app/" target="_blank">链接</a>|

## ❤️ 用爱发电

- **完全免费**：但希望你点一个 star ！！！
- **非常简洁**：没有复杂的封装，没有复杂的类型体操，开箱即用
- **详细的注释**：各个配置项都写有尽可能详细的注释
- **最新的依赖**: 定期更新所有三方依赖至最新版
- **有一点规整**: 代码风格统一，命名风格统一，注释风格统一

## 项目亮点

- **最新技术栈**：Vue 3.3、TypeScript 5.x 等新技术和 script setup API。
- **Antd Vue**：使用Ant-Design-Vue 4.x 版本。
- **Pinia**: 被视为 Vuex 的继任者,传说中的 Vuex5。
- **Vite**：以快速著称的现代化构建工具。
- **Vue Router**：Vue Router 管理路由。
- **TypeScript**：超越传统 JavaScript 语言的静态类型方案。
- **Pnpm**：快速且节省空间的包管理工具。
- **Scss**：用于定制布局和颜色风格。
- **ESLint & Prettier**：代码校验与格式化工具。
- **Axios**：网络请求库（已封装好）。
- **兼容移动端**: 布局兼容移动端页面分辨率(开发中)。

## 功能特色

- **用户管理**：登录、登出演示
- **权限管理**：内置页面权限（动态路由）、指令权限、权限函数、路由守卫(coding)
- **多环境**：多环境支持,适配开发、预发布和生产环境。
- **多主题**：内置普通、黑暗、自定义主题模式。
- **多布局**：内置左侧、顶部、混合三种布局模式(开发中)。
- **错误页面**: 错误处理页面，如403、404。
- **Dashboard**：根据用户角色定制化显示。
- **其他内置功能**：如SVG、动态侧边栏、动态面包屑、标签页快捷导航、Screenfull 全屏、自适应收缩侧边栏、Hook（Composables）

## 🚀 开发

```js
# 开发前配置
1. 全面安装一键配置
2. node 版本 16+
3. pnpm 版本 8.x

# 克隆项目
git clone https://github.com/xoxosos/vue-ace-admin.git

# 进入项目目录
cd vue-ace-admin

# 安装依赖
pnpm i

# 启动服务
pnpm dev
```

## ✔️ 预览

```js
# 预览预发布环境
pnpm preview:stage

# 预览正式环境
pnpm preview:prod
```

## 📦️ 多环境打包

```js
# 构建预发布环境
pnpm build:stage

# 构建正式环境
pnpm build:prod
```

## 🔧 代码检查

```js
# 代码检查与格式化，只需执行相应的命令。
pnpm lint

```

## Git 提交规范参考
Git 提交规范，包含了常见的提交类型，方便开发者追踪和管理变更。
- `feat` 增加新的业务功能
- `fix` 修复业务问题/BUG
- `perf` 优化性能
- `style` 更改代码风格, 不影响运行结果
- `refactor` 重构代码
- `revert` 撤销更改
- `test` 测试相关, 不涉及业务代码的更改
- `docs` 文档和注释相关
- `chore` 更新依赖/修改脚手架配置等琐事
- `workflow` 工作流改进
- `ci` 持续集成相关
- `types` 类型定义文件更改
- `wip` 开发中

## 项目预览图

<div>
   <img src="https://pic.imgdb.cn/item/654b506fc458853aef84d579.jpg" alt="blob">
</div>


## 💕 感谢 Star

若您喜欢这个项目，请不吝赐予 star 支持，这是维护者持续更新的动力。（小声：毕竟是免费的）


## 📄 License

本项目采用 [MIT](./LICENSE) 许可协议，版权归 [AceLin](https://github.com/xoxosos)所有。

Copyright (c) 2023-present [AceLin](https://github.com/xoxosos)
