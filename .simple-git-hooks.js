module.exports = {
  'pre-commit': 'npx lint-staged',
  'pre-push': 'pnpm format',
  'commit-msg': 'npx commitlint -e $1'
}
