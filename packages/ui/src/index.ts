import type { App } from 'vue'
import ProButton from './pro-button/ProButton.vue'
import ProTable from './pro-table/ProTable.vue'
import ProSearchForm from './pro-search-form/ProSearchForm.vue'
import StatisticCard from './statistic/StatisticCard.vue'
import TinymceEditor from './tinymce/TinymceEditor.vue'
import BaseUpload from './upload/BaseUpload.vue'

// 导入样式
import './pro-table/style.css'

if (typeof console !== 'undefined') {
  console.info(`@codexlin/ace-admin-ui loaded [${Math.random().toString(36).slice(2, 8)}]`)
}

// 导出组件
export { ProButton, ProTable, ProSearchForm, StatisticCard, TinymceEditor, BaseUpload }

// 导出类型
export type { ProButtonProps, ConfirmProps } from './pro-button/type'
export type { ProTableProps, IData as ProTableData } from './pro-table/type'
export type { ProSearchFormProps, Field as SearchField } from './pro-search-form/type'

// 导出 Hooks
export { useList, message, errorMessage, warningMessage, infoMessage } from './hooks/useList'
export type { OptionsType, UseListResult, UseListOptions, UseListParams } from './hooks/useList'

// 导出工具
export { useDebouncedRef } from '@codexlin/ace-admin-hooks'

// 导出 Hooks
export { usePagination } from './hooks/usePagination'

// Vue 插件
export default {
  install(app: App) {
    app.component('ProButton', ProButton)
    app.component('ProTable', ProTable)
    app.component('ProSearchForm', ProSearchForm)
    app.component('StatisticCard', StatisticCard)
    app.component('TinymceEditor', TinymceEditor)
    app.component('BaseUpload', BaseUpload)
  }
}
