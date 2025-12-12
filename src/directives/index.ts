import type { App } from 'vue'

import permission from './common/permission'
export default function directives(app: App) {
  permission(app)
}
