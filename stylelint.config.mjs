/** @type {import('stylelint').Config} */
export default {
  root: true,
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss'
  ],
  plugins: ['stylelint-scss'],
  ignoreFiles: [
    'dist/**/*',
    'node_modules/**/*',
    'coverage/**/*',
    '*.min.css',
    'public/**/*'
  ],
  rules: {
    // SCSS相关
    'scss/at-rule-no-unknown': true,
    'scss/dollar-variable-pattern': null,

    // 函数相关（清理重复配置）
    'function-no-unknown': [true, {
      ignoreFunctions: ['/^get-/', '/^v-/']
    }],

    // 供应商前缀
    'value-no-vendor-prefix': null,
    'property-no-vendor-prefix': null,

    // 类名模式
    'selector-class-pattern':
      '^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$|^Mui.*$|^([a-z][a-z0-9]*)(_[a-z0-9]+)*$',

    // 字体相关
    'font-family-no-missing-generic-family-keyword': null,

    // 空规则和源文件
    'block-no-empty': null,
    'no-empty-source': null,

    // 未知属性和选择器
    'property-no-unknown': null,
    'no-descending-specificity': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['export', 'deep', 'global', 'import']
      }
    ],

    // 空行规则
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment']
      }
    ],
    'custom-property-empty-line-before': [
      'always',
      {
        except: ['after-custom-property', 'first-nested']
      }
    ],
    'declaration-empty-line-before': [
      'always',
      {
        except: ['after-declaration', 'first-nested']
      }
    ],

    // At规则
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'function',
          'if',
          'each',
          'include',
          'mixin',
          'return',
          'use'
        ]
      }
    ],

    // 单位
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }]
  },
  overrides: [
    {
      files: ['src/**/*.vue'],
      rules: {
        // Vue文件特定的规则
        'declaration-property-value-no-unknown': null,
        'property-no-unknown': null,
        'selector-pseudo-class-no-unknown': [
          true,
          {
            // 合并全局和Vue特定的忽略伪类
            ignorePseudoClasses: ['export', 'deep', 'global', 'import', 'v-deep']
          }
        ]
      }
    }
  ]
}