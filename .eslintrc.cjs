/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    node: true
  },
  rules: {
    // 可选开启kebab-case写法 规则默认的是PascalCase的写法
    // 'vue/component-name-in-template-casing': [
    //   'error',
    //   'kebab-case',
    //   {
    //     registeredComponentsOnly: true,
    //     ignores: []
    //   }
    // ],
    // 强制标签执行自动关闭
    // 'vue/html-self-closing': [
    //   'error',
    //   {
    //     html: {
    //       void: 'never'
    //     }
    //   }
    // ],
    // 此规则将强制注释<!--前后的间距保持一致。
    'vue/html-comment-content-spacing': [
      'error',
      'always',
      {
        exceptions: []
      }
    ],
    'no-debugger': 'error',
    // 禁止使用 var
    'no-var': 'error',
    // 优先使用 interface 而不是 type
    // '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    eqeqeq: 2, //必须使用全等
    'max-lines': ['error', 500], // 限制行数 请勿修改 请优化你的代码
    complexity: ['error', 15], // 限制复杂度
    'require-await': 'error'
  }
}
