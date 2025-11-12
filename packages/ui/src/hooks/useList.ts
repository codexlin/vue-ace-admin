import { message as AntMessage } from 'ant-design-vue'
import type { Ref } from 'vue'
import { useList as useCoreList } from '@ace-admin/hooks'
import type { UseListRequestFn, UseListOptions, UseListResult } from '@ace-admin/hooks'

type ListRequestFnType<Response = any> = UseListRequestFn<Response>

export type OptionsType<
  ItemType extends Record<string, any> = Record<string, any>,
  Response = any,
  FilterOption extends Record<string, any> = Record<string, any>
> = UseListOptions<ItemType, Response, FilterOption>

interface UseListProps<
  ItemType extends object = Record<string, any>,
  FilterOption extends object = Record<string, any>,
  Response = any
> {
  listRequestFn: ListRequestFnType<Response>
  filterOption?: Ref<FilterOption>
  options?: OptionsType<ItemType, Response, FilterOption>
}

export function message(message: string) {
  AntMessage.success(message)
}

export function warningMessage(message: string) {
  AntMessage.warning(message)
}

export function errorMessage(message: string) {
  AntMessage.error(message)
}

export function infoMessage(message: string) {
  AntMessage.info(message)
}

export function useList<
  ItemType extends object = Record<string, any>,
  FilterOption extends object = Record<string, any>,
  Response = any
>({ listRequestFn, filterOption, options }: UseListProps<ItemType, FilterOption, Response>): UseListResult<
  ItemType,
  FilterOption,
  Response
> {
  return useCoreList<ItemType, FilterOption, Response>({
    request: listRequestFn,
    filters: filterOption,
    options
  })
}

export type { UseListResult, UseListOptions, UseListParams, UseListSuccessContext } from '@ace-admin/hooks'
