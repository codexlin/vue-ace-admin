import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'

import { demoPreviewPlugin } from '@vitepress-code-preview/plugin'

export default defineConfig({
  base: '/vue-ace-admin/',
  title: 'Vue Ace Admin',
  description: 'Vue Ace Admin 文档与组件库',
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '主应用', link: '/guide/app/quick-start' },
      { text: '组件库', link: '/components/' },
      { text: 'Hooks', link: '/hooks/useList' },
      { text: '场景示例', link: '/scenarios/search-table' }
    ],
    sidebar: {
      '/guide/': [
        { text: '介绍', link: '/guide/' },
        {
          text: '主应用',
          items: [{ text: '快速上手', link: '/guide/app/quick-start' }]
        },
        {
          text: '组件库',
          items: [
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '安装', link: '/guide/installation' },
            { text: '主题定制', link: '/guide/theme' }
          ]
        },
        { text: '开发指南', link: '/guide/development' },
        { text: '部署指南', link: '/guide/deployment' }
      ],
      '/components/': [
        { text: '组件总览', link: '/components/' },
        {
          text: '基础组件',
          items: [{ text: 'ProButton 按钮', link: '/components/pro-button/' }]
        },
        {
          text: '业务组件',
          items: [
            { text: 'ProSearchForm 搜索表单', link: '/components/pro-search-form/' },
            { text: 'ProTable 表格', link: '/components/pro-table/' }
          ]
        }
      ],
      '/hooks/': [{ text: 'useList 列表管理', link: '/hooks/useList' }],
      '/scenarios/': [{ text: '搜索表单+表格', link: '/scenarios/search-table' }]
    }
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../', import.meta.url)),
        '@codexlin/ace-admin-ui': fileURLToPath(new URL('../../packages/ui/src/index.ts', import.meta.url)),
        '@codexlin/ace-admin-hooks': fileURLToPath(new URL('../../packages/hooks/src/index.ts', import.meta.url))
      }
    },
    ssr: {
      noExternal: [/^ant-design-vue/, /^@ant-design/, /^scroll-into-view-if-needed/]
    }
  },
  markdown: {
    config(md) {
      const docRoot = fileURLToPath(new URL('../', import.meta.url))
      md.use(demoPreviewPlugin, { docRoot })
    }
  }
})
