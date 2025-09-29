import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'

import { demoPreviewPlugin } from '@vitepress-code-preview/plugin'

export default defineConfig({
  title: 'Ace Admin',
  description: 'Ace Admin 文档与组件库',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/quick-start' },
      { text: '组件', link: '/components/button/' }
    ],
    sidebar: {
      '/guide/': [
        { text: '介绍', link: '/guide/' },
        { text: '快速开始', link: '/guide/quick-start' },
        { text: '安装', link: '/guide/installation' },
        { text: '主题定制', link: '/guide/theme' },
        { text: '设计指南', link: '/guide/design' }
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button/' },
            { text: 'Input 输入框', link: '/components/input/' },
            { text: 'Select 选择器', link: '/components/select/' },
            { text: 'Switch 开关', link: '/components/switch/' }
          ]
        }
      ]
    }
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../', import.meta.url))
      }
    }
  },
  markdown: {
    config(md) {
      const docRoot = fileURLToPath(new URL('../', import.meta.url))
      md.use(demoPreviewPlugin, { docRoot })
    }
  }
})
