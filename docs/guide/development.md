# 开发指南

> 本指南帮助开发者了解如何参与 Vue Ace Admin 项目的开发。

## 🏗️ Monorepo 开发

Vue Ace Admin 采用 Monorepo 架构，使用 `pnpm workspace` 管理多个包。

### 项目结构

```
vue-ace-admin/
├── packages/
│   ├── hooks/          # @codexlin/ace-admin-hooks
│   └── ui/             # @codexlin/ace-admin-ui
├── src/                # 主应用
└── docs/               # 文档站点
```

### 本地开发方式

在本地开发时，主应用和文档都使用 workspace 包：

```json
{
  "dependencies": {
    "@codexlin/ace-admin-hooks": "workspace:*",
    "@codexlin/ace-admin-ui": "workspace:*"
  }
}
```

**优势：**
- ✅ 直接使用源码，修改立即生效
- ✅ 无需构建，开发效率高
- ✅ 完整的 TypeScript 类型支持

### 开发流程

1. **修改包代码**
   ```bash
   # 修改 packages/ui/src/ 或 packages/hooks/src/
   ```

2. **主应用自动使用最新代码**
   - 主应用通过 `workspace:*` 自动链接到本地包
   - 修改后立即生效，无需重新安装

3. **构建包（如需要）**
   ```bash
   # 构建 hooks 包
   pnpm build:hooks
   
   # 构建 ui 包
   pnpm build:ui
   ```

## 📦 本地开发 vs npm 使用

### 本地开发（Monorepo）

**package.json:**
```json
{
  "dependencies": {
    "@codexlin/ace-admin-ui": "workspace:*"
  }
}
```

**使用方式:**
```typescript
import { ProTable } from '@codexlin/ace-admin-ui'
import '@codexlin/ace-admin-ui/dist/ace-admin-ui.css'
```

**工作原理:**
- pnpm workspace 自动将 `workspace:*` 解析为本地 `packages/ui` 目录
- 直接使用源码，无需构建（开发时）
- 类型声明从 `packages/ui/src` 或 `packages/ui/dist/types` 解析

### npm 发布后（外部用户）

**安装:**
```bash
pnpm add @codexlin/ace-admin-ui
```

**使用方式（完全一致）:**
```typescript
import { ProTable } from '@codexlin/ace-admin-ui'
import '@codexlin/ace-admin-ui/dist/ace-admin-ui.css'
```

**工作原理:**
- npm 从 registry 下载包到 `node_modules/@codexlin/ace-admin-ui`
- 使用构建后的文件（`dist/` 目录）
- 类型声明从 `node_modules/@codexlin/ace-admin-ui/dist/types` 解析

### ✅ 使用方式完全一致

本地开发和 npm 发布后的使用方式**完全一致**：

- ✅ 相同的导入语句
- ✅ 相同的样式导入路径
- ✅ 相同的类型支持
- ✅ 相同的 API

这意味着文档中的示例代码可以直接使用，无需区分本地开发还是 npm 使用。

## 🔧 开发工具

### TypeScript

项目使用 TypeScript 5.x，提供完整的类型支持。

**类型检查:**
```bash
pnpm type-check
```

### 代码规范

- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **Stylelint**: 样式检查

**运行检查:**
```bash
pnpm lint
```

### Git Hooks

使用 `simple-git-hooks` 管理 Git hooks：

- `pre-commit`: 运行 lint-staged
- `commit-msg`: 运行 commitlint
- `pre-push`: 运行 prettier

## 🚀 如何参与开发

### 1. Fork 项目

```bash
# Fork 项目到你的 GitHub
```

### 2. 克隆你的 Fork

```bash
git clone https://github.com/你的用户名/vue-ace-admin.git
cd vue-ace-admin
```

### 3. 创建开发分支

```bash
git checkout -b feat-你的功能
```

### 4. 安装依赖

```bash
pnpm install
```

### 5. 开发

- 修改代码
- 运行测试
- 确保代码规范

### 6. 提交代码

```bash
git add .
git commit -m "feat: 你的功能描述"
git push origin feat-你的功能
```

### 7. 创建 Pull Request

在 GitHub 上创建 Pull Request，描述你的更改。

## 📝 代码规范

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

**示例:**
```bash
feat: 添加 ProButton 组件
fix: 修复 ProTable 分页问题
docs: 更新快速开始文档
```

### 代码风格

- 使用 TypeScript
- 遵循 ESLint 规则
- 使用 Prettier 格式化
- 添加必要的注释

## 🔍 调试技巧

### 1. 查看包链接

```bash
pnpm list @codexlin/ace-admin-ui
```

### 2. 重新链接包

```bash
pnpm install
```

### 3. 构建并查看类型

```bash
pnpm build:ui
# 查看 packages/ui/dist/types/
```

## 📚 相关文档

- [项目介绍](/guide/) - 了解项目架构
- [组件文档](/components/) - 查看组件 API
- [部署指南](/guide/deployment) - 部署应用

