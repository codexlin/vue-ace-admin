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
    ecmaVersion: 'latest'
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
    'vue/html-self-closing': [
      'error',
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
    // 此规则将强制注释<!--前后的间距保持一致。
    'vue/html-comment-content-spacing': [
      'error',
      'always',
      {
        exceptions: []
      }
    ],
    // 禁止使用 var
    'no-var': 'error',
    eqeqeq: 2, //必须使用全等
    'max-lines': ['error', 500], // 限制行数 请勿修改 请优化你的代码
    complexity: ['error', 15], // 限制复杂度
    'require-await': 'error',
    // 声明后永远不会重新分配的变量需要 const 声明
    'prefer-const': 'error',
    // 禁止不规则空格
    'no-irregular-whitespace': 'off',
    // 禁止使用 debugger
    'no-debugger': 'off'
  }
}
