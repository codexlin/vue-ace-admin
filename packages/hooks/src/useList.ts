import { isRef, nextTick, onScopeDispose, ref, unref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>

export type UseListRequestFn<Response = any, Params extends Record<string, any> = Record<string, any>> = MaybeRef<
  (params?: Params) => Promise<Response> | Response
>

export interface UseListBuildParamsContext<FilterOption extends Record<string, any>> {
  page: number
  pageSize: number
  filters: FilterOption | undefined
  extra: Record<string, any>
}

export interface UseListSuccessContext<ItemType, Response, FilterOption extends Record<string, any>> {
  response: Response
  items: ItemType[]
  total: number
  params: Record<string, any>
  filters: FilterOption | undefined
}

export interface UseListOptions<
  ItemType extends Record<string, any> = Record<string, any>,
  Response = any,
  FilterOption extends Record<string, any> = Record<string, any>
> {
  /**
   * 初始化是否自动执行一次 loadData，默认 false
   */
  immediate?: boolean
  /**
   * 是否监听分页变化自动重新请求，默认 true
   */
  autoWatchPagination?: boolean
  /**
   * 分页初始配置
   */
  pagination?: {
    current?: number
    pageSize?: number
  }
  /**
   * 请求成功回调
   */
  onSuccess?: (context: UseListSuccessContext<ItemType, Response, FilterOption>) => void
  /**
   * 请求失败回调
   */
  onError?: (error: unknown) => void
  /**
   * 是否在请求失败时抛出异常，默认 false
   */
  throwOnError?: boolean
  /**
   * 自定义响应转换
   */
  transform?: (response: Response) => { items: ItemType[]; total?: number }
  /**
   * 自定义参数构建
   */
  buildParams?: (context: UseListBuildParamsContext<FilterOption>) => Record<string, any>
  /**
   * 自定义筛选项重置逻辑
   */
  resetFilters?: (filters: Ref<FilterOption>) => void
  /**
   * 是否监听筛选条件变化自动触发请求，默认 true
   */
  watchFilters?: boolean
  /**
   * 筛选条件变化时是否自动重置页码为 1，默认 true
   */
  resetPageOnFilterChange?: boolean
  /**
   * 筛选条件变化自动请求时的防抖时长，单位 ms，默认 0（不防抖）
   */
  filterDebounce?: number
}

export interface UseListFiltersConfig<FilterOption extends Record<string, any> = Record<string, any>> {
  state: Ref<FilterOption>
  autoWatch?: boolean
  resetPageOnChange?: boolean
  debounce?: number
}

export interface UseListPaginationConfig {
  state?: {
    current?: number | Ref<number>
    pageSize?: number | Ref<number>
  }
  autoWatch?: boolean
}

export interface UseListExtraOptions<
  ItemType extends Record<string, any> = Record<string, any>,
  Response = any,
  FilterOption extends Record<string, any> = Record<string, any>
> {
  immediate?: boolean
  onSuccess?: (context: UseListSuccessContext<ItemType, Response, FilterOption>) => void
  onError?: (error: unknown) => void
  throwOnError?: boolean
  transform?: (response: Response) => { items: ItemType[]; total?: number }
  buildParams?: (context: UseListBuildParamsContext<FilterOption>) => Record<string, any>
  resetFilters?: (filters: Ref<FilterOption>) => void
}

export interface UseListLegacyParams<
  ItemType extends Record<string, any> = Record<string, any>,
  FilterOption extends Record<string, any> = Record<string, any>,
  Response = any
> {
  request: UseListRequestFn<Response>
  filters?: Ref<FilterOption>
  options?: UseListOptions<ItemType, Response, FilterOption>
}

export interface UseListModernParams<
  ItemType extends Record<string, any> = Record<string, any>,
  FilterOption extends Record<string, any> = Record<string, any>,
  Response = any
> {
  request: UseListRequestFn<Response>
  filters?: UseListFiltersConfig<FilterOption>
  pagination?: UseListPaginationConfig
  extra?: UseListExtraOptions<ItemType, Response, FilterOption>
}

export type UseListParams<
  ItemType extends Record<string, any> = Record<string, any>,
  FilterOption extends Record<string, any> = Record<string, any>,
  Response = any
> = UseListLegacyParams<ItemType, FilterOption, Response> | UseListModernParams<ItemType, FilterOption, Response>

export interface UseListResult<
  ItemType extends Record<string, any>,
  _FilterOption extends Record<string, any>,
  Response
> {
  dataSource: Ref<ItemType[]>
  loading: Ref<boolean>
  total: Ref<number>
  error: Ref<unknown>
  curPage: Ref<number>
  pageSize: Ref<number>
  loadData: (page?: number, extra?: Record<string, any>) => Promise<Response | undefined>
  reset: () => Promise<Response | undefined> | void
  setCurPage: (page: number, options?: { emitLoad?: boolean }) => void
  setPageSize: (size: number, options?: { emitLoad?: boolean }) => void
}

const cloneDeep = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => cloneDeep(item)) as unknown as T
  }
  if (value && typeof value === 'object') {
    const result: Record<string, any> = {}
    Reflect.ownKeys(value as Record<string, any>).forEach((key) => {
      const entry = Reflect.get(value as Record<string, any>, key)
      Reflect.set(result, key, cloneDeep(entry as unknown))
    })
    return result as T
  }
  return value
}

const resolveRequest = <Response, Params extends Record<string, any>>(request: UseListRequestFn<Response, Params>) => {
  const resolved = isRef(request) ? request.value : request
  return resolved as (params?: Params) => Promise<Response> | Response
}

const defaultTransform = <ItemType extends Record<string, any>, Response>(
  response: Response
): { items: ItemType[]; total: number } => {
  const data = (response as any)?.data ?? response
  const list = data?.list ?? data ?? []
  const items = Array.isArray(list) ? list : []
  const total = Number(data?.total ?? items.length ?? 0)
  return { items, total }
}

export function useList<
  ItemType extends Record<string, any> = Record<string, any>,
  FilterOption extends Record<string, any> = Record<string, any>,
  Response = any
>(params: UseListParams<ItemType, FilterOption, Response>): UseListResult<ItemType, FilterOption, Response> {
  const isFiltersConfig = (value: unknown): value is UseListFiltersConfig<FilterOption> =>
    !!value && typeof value === 'object' && 'state' in (value as Record<string, any>)

  const isModernParams = (
    value: UseListParams<ItemType, FilterOption, Response>
  ): value is UseListModernParams<ItemType, FilterOption, Response> =>
    'pagination' in value || 'extra' in value || (value.filters !== undefined && isFiltersConfig(value.filters))

  const modern = isModernParams(params) ? params : undefined
  const legacy = modern ? undefined : (params as UseListLegacyParams<ItemType, FilterOption, Response>)

  const extraOptions = (modern?.extra ?? legacy?.options ?? {}) as UseListExtraOptions<
    ItemType,
    Response,
    FilterOption
  > &
    Partial<UseListOptions<ItemType, Response, FilterOption>>

  let filtersRef: Ref<FilterOption> | undefined
  let watchFilters = false
  let resetPageOnFilterChange = true
  let filterDebounce = 0

  let paginationAutoWatch = true
  let initialCurrent = 1
  let initialPageSize = 10
  let externalCurPageRef: Ref<number> | undefined
  let externalPageSizeRef: Ref<number> | undefined
  let filterDebounceTimer: ReturnType<typeof setTimeout> | null = null

  if (modern) {
    const filtersConfig = modern.filters
    if (filtersConfig) {
      filtersRef = filtersConfig.state
      watchFilters = filtersConfig.autoWatch === true
      resetPageOnFilterChange = filtersConfig.resetPageOnChange !== false
      filterDebounce = watchFilters ? (filtersConfig.debounce ?? 0) : 0
    }

    const paginationConfig = modern.pagination ?? {}
    if (paginationConfig.state?.current !== undefined) {
      if (isRef(paginationConfig.state.current)) {
        externalCurPageRef = paginationConfig.state.current
        initialCurrent = externalCurPageRef.value ?? 1
      } else {
        initialCurrent = paginationConfig.state.current ?? 1
      }
    }
    if (paginationConfig.state?.pageSize !== undefined) {
      if (isRef(paginationConfig.state.pageSize)) {
        externalPageSizeRef = paginationConfig.state.pageSize
        initialPageSize = externalPageSizeRef.value ?? 10
      } else {
        initialPageSize = paginationConfig.state.pageSize ?? 10
      }
    }
    paginationAutoWatch = paginationConfig.autoWatch !== false
  } else if (legacy) {
    filtersRef = legacy.filters
    watchFilters = !!filtersRef && legacy.options?.watchFilters === true
    resetPageOnFilterChange = legacy.options?.resetPageOnFilterChange !== false
    filterDebounce = watchFilters ? (legacy.options?.filterDebounce ?? 0) : 0

    const pagination = legacy.options?.pagination ?? {}
    initialCurrent = pagination.current ?? 1
    initialPageSize = pagination.pageSize ?? 10
    paginationAutoWatch = legacy.options?.autoWatchPagination !== false
  }

  const curPage = ref(initialCurrent)
  const pageSize = ref(initialPageSize)
  const loading = ref(false)
  const total = ref(0)
  const errorState = ref<unknown>(null)
  const dataSource = ref<ItemType[]>([]) as Ref<ItemType[]>

  const initialFilters = filtersRef ? cloneDeep(unref(filtersRef) ?? ({} as FilterOption)) : null

  let suppressWatch = false

  const runWithSuppress = async (runner: () => Promise<Response | undefined>) => {
    suppressWatch = true
    const result = await runner()
    await nextTick()
    suppressWatch = false
    return result
  }

  const loadData = async (page = curPage.value, extra: Record<string, any> = {}) => {
    if (filterDebounceTimer) {
      clearTimeout(filterDebounceTimer)
      filterDebounceTimer = null
    }

    const executor = resolveRequest<Response, Record<string, any>>(params.request)
    const filterState = filtersRef ? unref(filtersRef) : undefined

    const paramsPayload = extraOptions.buildParams?.({
      page,
      pageSize: pageSize.value,
      filters: filterState as FilterOption | undefined,
      extra
    }) ?? {
      pageNum: page,
      pageSize: pageSize.value,
      ...(filterState as Record<string, any>),
      ...extra
    }

    loading.value = true
    errorState.value = null
    try {
      const response = await executor(paramsPayload)
      const { items, total: resolvedTotal } =
        extraOptions.transform?.(response) ?? defaultTransform<ItemType, Response>(response)

      dataSource.value = items
      total.value = Number.isFinite(resolvedTotal) ? Number(resolvedTotal) : items.length

      extraOptions.onSuccess?.({
        response,
        items,
        total: total.value,
        params: paramsPayload,
        filters: filterState as FilterOption | undefined
      })

      return response
    } catch (error) {
      errorState.value = error
      extraOptions.onError?.(error)
      if (extraOptions.throwOnError) {
        throw error
      }
      return undefined
    } finally {
      loading.value = false
    }
  }

  const setCurPage = (page: number, { emitLoad = true }: { emitLoad?: boolean } = {}) => {
    if (page === curPage.value) return
    if (emitLoad) {
      curPage.value = page
      if (!paginationAutoWatch) {
        void loadData(page)
      }
      return
    }
    void runWithSuppress(async () => {
      curPage.value = page
      return undefined
    })
  }

  const setPageSize = (size: number, { emitLoad = true }: { emitLoad?: boolean } = {}) => {
    if (size === pageSize.value) return
    if (emitLoad) {
      pageSize.value = size
      if (!paginationAutoWatch) {
        void loadData(curPage.value)
      }
      return
    }
    void runWithSuppress(async () => {
      pageSize.value = size
      return undefined
    })
  }

  if (externalCurPageRef) {
    watch(curPage, (val) => {
      if (externalCurPageRef && externalCurPageRef.value !== val) {
        externalCurPageRef.value = val
      }
    })
    watch(externalCurPageRef, (val) => {
      if (val === undefined || val === curPage.value) return
      setCurPage(val, { emitLoad: false })
    })
  }

  if (externalPageSizeRef) {
    watch(pageSize, (val) => {
      if (externalPageSizeRef && externalPageSizeRef.value !== val) {
        externalPageSizeRef.value = val
      }
    })
    watch(externalPageSizeRef, (val) => {
      if (val === undefined || val === pageSize.value) return
      setPageSize(val, { emitLoad: false })
    })
  }

  const reset = () => {
    if (!filtersRef) return

    if (extraOptions.resetFilters) {
      extraOptions.resetFilters(filtersRef)
    } else {
      if (initialFilters) {
        filtersRef.value = cloneDeep(initialFilters) as FilterOption
      } else {
        filtersRef.value = {} as FilterOption
      }
    }

    return loadData()
  }

  if (paginationAutoWatch) {
    watch([curPage, pageSize], () => {
      if (suppressWatch) return
      void loadData(curPage.value)
    })
  }

  if (filtersRef && watchFilters) {
    const triggerFilterLoad = () => {
      const targetPage = resetPageOnFilterChange ? 1 : curPage.value
      if (resetPageOnFilterChange && curPage.value !== 1) {
        setCurPage(1, { emitLoad: false })
      }
      void loadData(targetPage)
    }

    watch(
      filtersRef,
      () => {
        if (suppressWatch) return
        if (filterDebounce > 0) {
          if (filterDebounceTimer) clearTimeout(filterDebounceTimer)
          filterDebounceTimer = setTimeout(triggerFilterLoad, filterDebounce)
        } else {
          triggerFilterLoad()
        }
      },
      { deep: true }
    )

    if (filterDebounce > 0) {
      onScopeDispose(() => {
        if (filterDebounceTimer) {
          clearTimeout(filterDebounceTimer)
          filterDebounceTimer = null
        }
      })
    }
  }

  if (extraOptions.immediate) {
    void loadData()
  }

  return {
    dataSource,
    loading,
    total,
    error: errorState,
    curPage,
    pageSize,
    loadData,
    reset,
    setCurPage,
    setPageSize
  }
}
