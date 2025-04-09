import loadPlugins from './plugins'
import loadViteResolve from './resolve'
import loadViteServer from './server'
import loadViteBuild from './build'

const loadInitLog = () => {
  const colors = {
    reset: '\x1b[0m',
    fg: '\x1b[35m',
    bg: '\x1b[43m'
  }
  const LINK = 'https://github.com/codexlin/vue-ace-admin#readme'
  console.log(`${colors.fg} 😊如果您喜欢Ace Admin，不妨点个小⭐ ⭐  ==>:🔗${colors.bg}${LINK}${colors.reset}`)
}
export default { loadPlugins, loadViteResolve, loadViteServer, loadViteBuild, loadInitLog }
