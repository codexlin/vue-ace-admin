import type { App } from 'vue'
import ProButton from './pro-button/ProButton.vue'
import ProTable from './pro-table/ProTable.vue'
import ProSearchForm from './pro-search-form/ProSearchForm.vue'
import StatisticCard from './statistic/StatisticCard.vue'
import BaseUpload from './upload/BaseUpload.vue'

// 导入样式
import './pro-table/style.css'

if (typeof console !== 'undefined') {
  console.info(`@codexlin/ace-admin-ui loaded [${Math.random().toString(36).slice(2, 8)}]`)
}

// 导出组件
export { ProButton, ProTable, ProSearchForm, StatisticCard, BaseUpload }

// 导出类型
export type { ProButtonProps, ConfirmProps } from './pro-button/type'
export type { ProTableProps, IData as ProTableData } from './pro-table/type'
export type { ProSearchFormProps, Field as SearchField } from './pro-search-form/type'

// 导出工具函数（基于 Ant Design Vue 的消息提示）
export { message, errorMessage, warningMessage, infoMessage } from './utils/message'

// Vue 插件
export default {
  install(app: App) {
    app.component('ProButton', ProButton)
    app.component('ProTable', ProTable)
    app.component('ProSearchForm', ProSearchForm)
    app.component('StatisticCard', StatisticCard)
    app.component('BaseUpload', BaseUpload)
  }
}
