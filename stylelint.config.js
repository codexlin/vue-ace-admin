export default {
  root: true,
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order'],
  ignoreFiles: ['**/*', '!src/**/*', 'src/**/*.{js,jsx,ts,tsx}'],
  ignoreFunctions: ['/regex-as-string/', /regex/, 'non-regex'],
  rules: {
    'function-name-case': 'lower',
    'scss/dollar-variable-pattern': null,
    'block-no-empty': null,
    'comment-empty-line-before': null,
    'no-empty-source': null,
    'property-no-unknown': null,
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local', 'export', 'import', 'deep']
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
          'return'
        ]
      }
    ],
    'named-grid-areas-no-invalid': null,
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'first-nested']
      }
    ],
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    'order/order': [
      [
        'dollar-variables',
        'custom-properties',
        'at-rules',
        'declarations',
        {
          type: 'at-rule',
          name: 'supports'
        },
        {
          type: 'at-rule',
          name: 'media'
        },
        'rules'
      ],
      { severity: 'warning' }
    ]
  },
  overrides: [
    {
      files: ['src/**/*.vue'],
      extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended-vue'],
      rules: {
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
