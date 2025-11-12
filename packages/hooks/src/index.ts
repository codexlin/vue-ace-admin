// 纯 Vue 3 Composition API Hooks
if (typeof console !== 'undefined') {
  console.info(`@ace-admin/hooks loaded [${Math.random().toString(36).slice(2, 8)}]`)
}

export { useDebouncedRef } from './useDebouncedRef'
export { useLoading } from './useLoading'
export { useHasEventListener } from './useHasEventListener'
export { useEmitOrDefault } from './useEmitOrDefault'
export { usePagination } from './usePagination'
export {
  useList,
  type UseListParams,
  type UseListOptions,
  type UseListResult,
  type UseListSuccessContext,
  type UseListRequestFn
} from './useList'

// 类型导出
export type { UseLoading } from './useLoading'
export type { UseHasEventListener } from './useHasEventListener'
export type { UseEmitOrDefault } from './useEmitOrDefault'
export type { UsePaginationOptions, UsePaginationResult, PaginateStrategy } from './usePagination'
