import eslintPluginImportX from 'eslint-plugin-import-x'
import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { configureVueProject } from '@vue/eslint-config-typescript'

const autoImportPath = fileURLToPath(new URL('./.eslintrc-auto-import.json', import.meta.url))
const eslintrcAutoImport = JSON.parse(fs.readFileSync(autoImportPath, 'utf8'))

// 配置 Vue 项目以获得更好的 TypeScript 支持
configureVueProject({
  // 在 Vue 模板中解析 TypeScript 语法
  tsSyntaxInTemplates: true,

  // 指定允许的脚本语言
  scriptLangs: ['ts'],

  // 允许组件类型操作的安全性，避免一些误报
  allowComponentTypeUnsafety: true,

  // 指定 Vue 文件的根目录，优化性能
  rootDir: process.cwd()
})

export default defineConfigWithVueTs(
  // 全局配置
  globalIgnores([
    'node_modules/',
    'public/',
    'src/assets/',
    'tests/',
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**'
  ]),

  // 基础配置（Vue 和 TypeScript）
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommendedTypeChecked,
  ...pluginOxlint.configs['flat/recommended'],
  skipFormatting,

  // 项目自定义规则（覆盖默认配置）
  {
    plugins: {
      'import-x': eslintPluginImportX
    },
    // 这里是项目整体的 rule 配置
    files: ['src/**/*.{js,ts,jsx,tsx,vue}'],
    rules: {
      // Vue 3 基础规则
      'vue/no-irregular-whitespace': 'warn', // 不规则空白字符警告
      'vue/no-reserved-component-names': 'error', // 保留组件名错误
      'vue/no-unused-components': 'warn', // 未使用组件警告

      // 事件命名规范（必须使用 kebab-case）
      'vue/v-on-event-hyphenation': [
        'warn',
        'always',
        {
          autofix: true
        }
      ],

      // HTML 自闭合标签规则
      'vue/html-self-closing': [
        'warn',
        {
          html: {
            void: 'any', // void 标签任意
            normal: 'never', // 正常标签不自闭
            component: 'always' // 组件标签不自闭
          },
          svg: 'always', // SVG 标签自闭
          math: 'always' // Math 标签自闭
        }
      ],

      // 多词组件名规则
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index', 'default'] // 忽略常见的页面组件命名
        }
      ],

      // TypeScript 类型检查
      '@typescript-eslint/no-explicit-any': 'warn', // 警告使用 any 类型，但不阻止构建
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      // Promise 相关（重点）
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          // 避免在模板属性和事件处理上过严的误报
          checksVoidReturn: { attributes: false }
        }
      ],
      '@typescript-eslint/no-floating-promises': ['warn', { ignoreIIFE: true }],
      // 其他实用规则
      'sort-imports': 'off',
      'import-x/order': [
        'error',
        {
          groups: ['external', 'builtin', 'internal', 'type', 'parent', 'object', 'sibling', 'index'],
          'newlines-between': 'never'
        }
      ],
      'import-x/no-cycle': 'error',
      'import-x/no-self-import': 'error'
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      ...eslintrcAutoImport
    }
  },

  // 特定目录配置
  {
    files: ['docs/**/*.{js,ts,jsx,tsx,vue}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 0 // docs 目录不警告 any 类型
    }
  },

  // 组件库特定配置
  {
    files: ['packages/ui/**/*.{js,ts,jsx,tsx,vue}'],
    rules: {
      'vue/attribute-hyphenation': 0,
      'vue/singleline-html-element-content-newline': 0,
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index'] // 组件库中忽略 index 命名
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
)
