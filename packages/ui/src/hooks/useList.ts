import { message as AntMessage } from 'ant-design-vue'
import type { Ref } from 'vue'
import { useList as useCoreList } from '@ace-admin/hooks'
import type { UseListRequestFn, UseListOptions, UseListResult, UseListModernParams } from '@ace-admin/hooks'

type ListRequestFnType<Response = any> = UseListRequestFn<Response>

export type OptionsType<
  ItemType extends Record<string, any> = Record<string, any>,
  Response = any,
  FilterOption extends Record<string, any> = Record<string, any>
> = UseListOptions<ItemType, Response, FilterOption>

type UseListProps<
  ItemType extends object = Record<string, any>,
  FilterOption extends object = Record<string, any>,
  Response = any
> = UseListModernParams<ItemType, FilterOption, Response>

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
>(props: UseListProps<ItemType, FilterOption, Response>): UseListResult<ItemType, FilterOption, Response> {
  return useCoreList<ItemType, FilterOption, Response>(props)
}

export type { UseListResult, UseListOptions, UseListParams, UseListSuccessContext } from '@ace-admin/hooks'
