# 文档部署指南

## 📍 文档访问地址

### GitHub Pages（当前配置）

文档通过 GitHub Actions 自动部署到 **GitHub Pages**，访问地址：

**主要访问地址：**
- `https://codexlin.github.io/vue-ace-admin/`

**⚠️ 重要：首次部署需要配置 GitHub Pages Source**

1. 访问 GitHub 仓库设置：https://github.com/codexlin/vue-ace-admin/settings/pages
2. 在 **Build and deployment** → **Source** 部分：
   - 选择 **"Deploy from a branch"**
   - 在 **Branch** 下拉菜单中选择 **`gh-pages`** 分支
   - 点击 **Save** 按钮
3. 等待几分钟，GitHub Pages 会自动构建和部署
4. 部署完成后，访问地址会显示在页面顶部

**如何确认你的文档地址：**

1. 访问 GitHub 仓库：https://github.com/codexlin/vue-ace-admin
2. 进入 **Settings** → **Pages**
3. 在 **Source** 部分查看部署来源（应该是 `gh-pages` 分支）
4. 在页面顶部会显示你的文档访问地址

### 部署流程

1. **触发条件**：当代码推送到 `main` 分支时
2. **构建过程**：
   - 安装依赖：`pnpm install --no-frozen-lockfile`
   - 构建文档：`pnpm build:docs`
   - 输出目录：`./docs/.vitepress/dist`
3. **部署过程**：
   - 使用 `peaceiris/actions-gh-pages@v3` 将构建结果推送到 `gh-pages` 分支
   - GitHub Pages 自动从 `gh-pages` 分支提供静态文件服务

## 🔍 如何查看部署状态

### 1. 查看 GitHub Actions 运行状态

1. 访问：https://github.com/codexlin/vue-ace-admin/actions
2. 找到 `Deploy Vue Ace Admin` 工作流
3. 查看 `deploy-docs` job 的运行状态
4. 如果成功，会显示绿色的 ✓

### 2. 查看 gh-pages 分支

1. 访问：https://github.com/codexlin/vue-ace-admin/tree/gh-pages
2. 查看是否有最新的构建文件
3. 检查文件时间戳是否是最新的

### 3. 查看 GitHub Pages 设置

1. 访问：https://github.com/codexlin/vue-ace-admin/settings/pages
2. 查看 **Source** 是否设置为 `gh-pages` 分支
3. 查看页面顶部显示的访问地址

## ⚙️ 配置说明

### VitePress 配置

当前配置（`docs/.vitepress/config.ts`）：
- 没有设置 `base`，默认使用仓库根路径
- 如果仓库名称是 `vue-ace-admin`，访问路径是 `/vue-ace-admin/`

### 如果需要自定义 base 路径

如果文档部署在子路径下（如 `/vue-ace-admin/`），需要在 VitePress 配置中添加：

```typescript
export default defineConfig({
  base: '/vue-ace-admin/', // 如果部署在子路径
  title: 'Ace Admin',
  // ...
})
```

### 如果需要自定义域名

1. 在仓库根目录创建 `CNAME` 文件，内容为你的域名：
   ```
   docs.yourdomain.com
   ```

2. 更新工作流配置：
   ```yaml
   - name: Deploy to GitHub Pages
     uses: peaceiris/actions-gh-pages@v3
     with:
       cname: docs.yourdomain.com
   ```

3. 在 GitHub Pages 设置中配置自定义域名

## 🚀 手动触发部署

如果需要手动触发文档部署：

1. **通过 GitHub Actions UI**：
   - 访问 Actions 页面
   - 选择 `Deploy Vue Ace Admin` 工作流
   - 点击 "Run workflow"
   - 选择 `main` 分支
   - 点击 "Run workflow"

2. **通过推送代码**：
   ```bash
   # 修改任意文件（如 README.md）
   git commit --allow-empty -m "docs: trigger docs deployment"
   git push origin main
   ```

## 📝 本地预览文档

在部署前，可以在本地预览文档：

```bash
# 进入 docs 目录
cd docs

# 安装依赖（如果还没安装）
pnpm install

# 启动开发服务器
pnpm dev

# 或者从项目根目录
pnpm dev:docs
```

访问：http://localhost:5173

## 🔧 故障排查

### 问题 1：文档没有更新

**检查清单：**
- [ ] GitHub Actions 工作流是否成功运行
- [ ] `gh-pages` 分支是否有最新文件
- [ ] GitHub Pages 设置是否正确
- [ ] 浏览器缓存（尝试强制刷新 `Ctrl+F5` 或 `Cmd+Shift+R`）

### 问题 2：404 错误

**可能原因：**
- VitePress 的 `base` 配置不正确
- GitHub Pages 的 Source 设置错误
- 文件路径问题

**解决方案：**
1. 检查 `docs/.vitepress/config.ts` 中的 `base` 配置
2. 确认 GitHub Pages 的 Source 是 `gh-pages` 分支
3. 检查构建输出目录是否正确

### 问题 3：权限错误

如果看到权限错误，检查：
1. GitHub 仓库设置中的 Actions 权限
2. GitHub Pages 的权限设置
3. 工作流中的 `permissions` 配置

## 📚 相关链接

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [VitePress 部署指南](https://vitepress.dev/guide/deploy)
- [peaceiris/actions-gh-pages 文档](https://github.com/peaceiris/actions-gh-pages)

## 🎯 快速访问

- **文档地址**：https://codexlin.github.io/vue-ace-admin/
- **GitHub 仓库**：https://github.com/codexlin/vue-ace-admin
- **Actions 状态**：https://github.com/codexlin/vue-ace-admin/actions
- **Pages 设置**：https://github.com/codexlin/vue-ace-admin/settings/pages
