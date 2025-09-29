import type { App } from 'vue'
import ProButton from './pro-button/ProButton.vue'
import ProTable from './pro-table/ProTable.vue'

export { ProButton }
export { ProTable }

export type { Props as ProButtonProps } from './pro-button/type'
export type { IProps as ProTableProps } from './pro-table/type'

export default {
  install(app: App) {
    app.component('ProButton', ProButton)
    app.component('ProTable', ProTable)
  }
}
