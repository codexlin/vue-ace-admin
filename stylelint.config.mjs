/** @type {import('stylelint').Config} */
export default {
  root: true,
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss'
  ],
  plugins: ['stylelint-scss'],
  ignoreFiles: ['**/*', '!src/**/*', 'src/**/*.{js,jsx,ts,tsx}'],
  rules: {
    'scss/at-rule-no-unknown': true,
    'function-no-unknown': null,
    'value-no-vendor-prefix': null,
    'property-no-vendor-prefix': null,
    'function-no-unknown': [true, { ignoreFunctions: ['/^get-/', '/^v-/'] }],
    'selector-class-pattern':
      '^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$|^Mui.*$|^([a-z][a-z0-9]*)(_[a-z0-9]+)*$',
    'font-family-no-missing-generic-family-keyword': null,
    'scss/dollar-variable-pattern': null,
    'block-no-empty': null,
    'no-empty-source': null,
    'property-no-unknown': null,
    'no-descending-specificity': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['export', 'deep', 'global', 'import']
      }
    ],
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
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }]
  },
  overrides: [
    {
      files: ['src/**/*.vue'],
      rules: {
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