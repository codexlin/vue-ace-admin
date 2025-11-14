# GitHub 仓库设置指南

## 📋 Actions 权限配置

### 1. 进入仓库设置

1. 访问仓库：https://github.com/codexlin/vue-ace-admin
2. 点击仓库页面右上角的 **Settings** 按钮

### 2. 配置 Actions 权限

1. 在左侧菜单中找到并点击 **Actions**
2. 在 **Actions** 下点击 **General**
3. 滚动到 **Workflow permissions** 部分
4. 选择 **Read and write permissions** 选项
5. （可选）勾选 **Allow GitHub Actions to create and approve pull requests**
6. 点击页面底部的 **Save** 按钮保存

### 3. 启用 GitHub Pages

1. 在左侧菜单中找到并点击 **Pages**
2. 在 **Source** 部分：
   - 选择 **GitHub Actions**（而不是 "Deploy from a branch"）
   - 保存更改

### 4. 验证配置

1. 推送到 `main` 分支
2. 在 **Actions** 标签页中查看工作流运行状态
3. 如果部署成功，可以在 **Settings → Pages** 中看到部署的 URL

## 🔧 当前工作流配置

工作流文件 `.github/workflows/deploy.yml` 中已配置以下权限：

```yaml
permissions:
  contents: write      # 允许写入仓库内容（推送到 gh-pages 分支）
  pages: write         # 允许部署到 GitHub Pages
  id-token: write      # 允许使用 OIDC token
```

## ❓ 常见问题

### Q: 为什么需要 `contents: write` 权限？

A: GitHub Pages 部署需要将构建后的文件推送到 `gh-pages` 分支，这需要写入权限。

### Q: 如果仍然出现权限错误怎么办？

A: 
1. 检查仓库是否是组织仓库，如果是，需要在组织设置中允许 Actions 写入
2. 检查仓库的 **Settings → Actions → General → Workflow permissions** 是否设置为 **Read and write permissions**
3. 确认 GitHub Pages 的 Source 已设置为 **GitHub Actions**

### Q: 如何查看部署的文档？

A: 部署成功后，文档地址通常是：`https://<username>.github.io/vue-ace-admin/` 或 `https://<username>.github.io/<repo-name>/`

## 📚 参考文档

- [GitHub Actions 权限配置](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)
- [GitHub Pages 部署](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [peaceiris/actions-gh-pages 文档](https://github.com/peaceiris/actions-gh-pages)
