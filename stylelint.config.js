export default {
  // 设置为根路径
  root: true,
  extends: [
    'stylelint-config-recess-order',
    'stylelint-config-standard-scss', // 添加 SCSS 配置
    'stylelint-config-recommended-vue/scss' // 添加 Vue 支持
  ],
  plugins: [
    'stylelint-scss' // 安装插件
  ],
  // 忽略所有文件，除了 src 目录下的文件，并且忽略 src 目录下的 JavaScript 和 TypeScript 文件。
  ignoreFiles: ['**/*', '!src/**/*', 'src/**/*.{js,jsx,ts,tsx}'],
  rules: {
    'scss/at-rule-no-unknown': true,
    'function-no-unknown': null,
    'value-no-vendor-prefix': null,
    'property-no-vendor-prefix': null,
    // 忽略以 get- 和 v- 开头的函数
    // 'function-no-unknown': [true, { ignoreFunctions: ['/^get-/', '/^v-/'] }],
    // 强制类名遵循特定的命名模式，支持 BEM 命名法和 Mui 前缀的类名。
    'selector-class-pattern':
      '^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$|^Mui.*$|^([a-z][a-z0-9]*)(_[a-z0-9]+)*$',
    'font-family-no-missing-generic-family-keyword': null,
    'scss/dollar-variable-pattern': null,
    'block-no-empty': null,
    'no-empty-source': null,
    'property-no-unknown': null,
    'no-descending-specificity': null,
    // 忽略未知的选择器
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['export', 'deep', 'global', 'import']
      }
    ],
    // 在规则之前总是添加空行，除了第一个嵌套规则和注释后面的规则。
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment']
      }
    ],
    // 在自定义属性之前总是添加空行，除了在另一个自定义属性之后和第一个嵌套规则。
    'custom-property-empty-line-before': [
      'always',
      {
        except: ['after-custom-property', 'first-nested']
      }
    ],
    // 在声明之前总是添加空行，除了在另一个声明之后和第一个嵌套规则。
    'declaration-empty-line-before': [
      'always',
      {
        except: ['after-declaration', 'first-nested']
      }
    ],
    // 忽略以下at规则
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
    // 忽略 rpx 单位。
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-order': ['width', 'height']
  },
  overrides: [
    {
      files: ['src/**/*.vue'],
      extends: [
        'stylelint-config-recess-order',
        'stylelint-config-standard-scss', // 添加 SCSS 配置
        'stylelint-config-recommended-vue/scss' // 添加 Vue 支持
      ],
      plugins: [
        'stylelint-scss' // 安装插件
      ],
      rules: {
        // 关闭对未知函数的校验
        'declaration-property-value-no-unknown': null,
        'scss/dollar-variable-pattern': null,
        'block-no-empty': null,
        'comment-empty-line-before': null,
        'no-empty-source': null,
        'property-no-unknown': null,
        'selector-pseudo-class-no-unknown': [
          true,
          {
            ignorePseudoClasses: ['deep', 'v-deep']
          }
        ]
      }
    }
  ]
}
