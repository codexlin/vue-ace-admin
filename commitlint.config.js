export default {
  // 继承的规则
  extends: ['@commitlint/config-conventional'],
  // 自定义规则
  rules: {
    // type 类型定义，表示 git 提交的 type 必须在以下类型范围内
    'type-enum': [
      2,
      'always',
      [
        'feat', // 增加新功能
        'fix', //  修复问题/BUG
        'docs', // 文档/注释
        'style', // 代码风格相关无影响运行结果的（不影响功能，例如空格、分号等格式修正）
        'refactor', // 重构（既不是增加feature）,也不是修复bug
        'perf', // 优化/性能提升
        'test', // 增加测试或已有测试改动
        'chore', // 对脚手架配置或辅助工具和依赖的更改（不影响源文件、测试用例）
        'revert', // 回退/回滚 撤销修改
        'ci', // 修改 CI 配置、脚本
        'build', // 构建流程、外部依赖变更（如升级 npm 包、修改 webpack/vite 配置等）
        'workflow', //工作流改进
        'ci', //持续集成
        'types', // 类型定义文件更改
        'wip', // 开发中
        'release' // 发布
      ]
    ],
    // subject 大小写不做校验
    'subject-case': [0]
  },
  prompt: {
    messages: {
      type: '选择你要提交的类型 :',
      scope: '选择一个提交范围（可选）:',
      customScope: '请输入自定义的提交范围 :',
      subject: '填写简短精炼的变更描述 :\n',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      footerPrefixesSelect: '选择关联issue前缀（可选）:',
      customFooterPrefix: '输入自定义issue前缀 :',
      footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',
      generatingByAI: '正在通过 AI 生成你的提交简短描述...',
      generatedSelectByAI: '选择一个 AI 生成的简短描述:',
      confirmCommit: '是否提交或修改commit ?'
    },
    // prettier-ignore
    types: [
      { value: 'feat', name: 'feat:     ✨  新增功能 | A new feature', emoji: ':sparkles:' },
      { value: 'fix', name: 'fix:     🐛  修复缺陷 | A bug fix', emoji: ':bug:' },
      { value: 'docs', name: 'docs:     📝  文档更新 | Documentation only changes', emoji: ':memo:' },
      { value: 'style', name: 'style:     💄  代码格式 | Changes that do not affect the meaning of the code', emoji: ':lipstick:' },
      { value: 'refactor', name: 'refactor:     ♻️  代码重构 | A code change that neither fixes a bug nor adds a feature', emoji: ':recycle:' },
      { value: 'perf', name: 'perf:     ⚡️  性能优化 | A code change that improves performance', emoji: ':zap:' },
      { value: 'test', name: 'test:     ✅  测试相关 | Adding missing tests or correcting existing tests', emoji: ':white_check_mark:' },
      {
        value: 'build',
        name: 'build:     📦️  构建流程、依赖变更相关 | Changes that affect the build system or external dependencies',
        emoji: ':package:'
      },
      { value: 'ci', name: 'ci:     🎡  持续集成 | Changes to our CI configuration files and scripts', emoji: ':ferris_wheel:' },
      { value: 'revert', name: 'revert:     ⏪️  回退代码 | Revert to a commit', emoji: ':rewind:' },
      { value: 'chore', name: 'chore:     🔨  其他修改 | Other changes that do not modify src or test files', emoji: ':hammer:' }
    ],
    useEmoji: true,
    emojiAlign: 'center',
    useAI: false,
    aiNumber: 1,
    themeColorCode: '',
    scopes: [],
    allowCustomScopes: true,
    allowEmptyScopes: true,
    customScopesAlign: 'bottom',
    customScopesAlias: 'custom',
    emptyScopesAlias: 'empty',
    upperCaseSubject: false,
    markBreakingChangeMode: false,
    allowBreakingChanges: ['feat', 'fix'],
    breaklineNumber: 100,
    breaklineChar: '|',
    skipQuestions: [],
    issuePrefixes: [
      // 如果使用 gitee 作为开发管理
      { value: 'link', name: 'link:     链接 ISSUES 进行中' },
      { value: 'closed', name: 'closed:   标记 ISSUES 已完成' }
    ],
    customIssuePrefixAlign: 'top',
    emptyIssuePrefixAlias: 'skip',
    customIssuePrefixAlias: 'custom',
    allowCustomIssuePrefix: true,
    allowEmptyIssuePrefix: true,
    confirmColorize: true,
    scopeOverrides: undefined,
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: ''
  }
}
