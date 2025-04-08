// import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginImportX from 'eslint-plugin-import-x'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
import eslintPluginVue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'
import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

const autoImportPath = fileURLToPath(new URL('./.eslintrc-auto-import.json', import.meta.url))
const eslintrcAutoImport = JSON.parse(fs.readFileSync(autoImportPath, 'utf8'))
const tsEslint = ts.config(...ts.configs.recommended).map((config) => ({
  ...config,
  languageOptions: {
    ...config.languageOptions,
    parserOptions: {
      parser: '@typescript-eslint/parser'
    }
  }
}))
const vueEslint = eslintPluginVue.configs['flat/recommended']

export default [
  {
    plugins: {
      'import-x': eslintPluginImportX
    }
  },
  ...tsEslint,
  ...vueEslint,
  // js.configs.recommended,
  {
    ...eslintPluginPrettier,
    rules: {
      ...eslintPluginPrettier.rules,
      ...eslintConfigPrettier.rules
    }
  },
  {
    // 这里是项目整体的 rule 配置
    files: ['src/**/*.{js,ts,jsx,tsx,vue}'],
    rules: {
      // 0 off 1 warn 2 error 强制标签执行自动关闭
      // 'vue/script-setup-uses-vars': 2,
      'vue/v-on-event-hyphenation': [
        1,
        'always',
        {
          autofix: true
        }
      ],
      'vue/html-self-closing': [
        2,
        {
          html: {
            void: 'any',
            normal: 'always',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ],
      'vue/attribute-hyphenation': 0,
      'vue/singleline-html-element-content-newline': 0,
      'vue/multi-word-component-names': [
        2,
        {
          ignores: ['index'] // 忽略 index 命名，一般表示页面
        }
      ],
      '@typescript-eslint/no-explicit-any': 0, // 允许使用 any 类型
      '@typescript-eslint/no-unused-vars': 0,
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      'array-callback-return': 'error',
      'sort-imports': 'off',
      'import-x/order': [
        'error',
        {
          groups: ['external', 'builtin', 'internal', 'type', 'parent', 'object', 'sibling', 'index']
        }
      ],
      'import-x/no-cycle': 'error', // 禁止循环引用 暂不支持
      'import-x/no-self-import': 'error', // 禁止自引用 暂不支持
      'no-async-promise-executor': 'off'
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
  {
    ignores: ['node_modules/', 'dist/', 'public/', 'src/assets/', 'tests/']
  }
]
