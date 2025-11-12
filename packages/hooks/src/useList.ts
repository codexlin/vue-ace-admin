import { isRef, nextTick, ref, unref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>

export type UseListRequestFn<Response = any, Params extends Record<string, any> = Record<string, any>> =
  MaybeRef<(params?: Params) => Promise<Response> | Response>

export interface UseListBuildParamsContext<FilterOption extends Record<string, any>> {
  page: number
  pageSize: number
  filters: FilterOption | undefined
  extra: Record<string, any>
}

export interface UseListSuccessContext<
  ItemType,
  Response,
  FilterOption extends Record<string, any>
> {
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
}

export interface UseListParams<
  ItemType extends Record<string, any> = Record<string, any>,
  FilterOption extends Record<string, any> = Record<string, any>,
  Response = any
> {
  request: UseListRequestFn<Response>
  filters?: Ref<FilterOption>
  options?: UseListOptions<ItemType, Response, FilterOption>
}

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

const resolveRequest = <Response, Params extends Record<string, any>>(
  request: UseListRequestFn<Response, Params>
) => {
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
>({
  request,
  filters,
  options
}: UseListParams<ItemType, FilterOption, Response>): UseListResult<ItemType, FilterOption, Response> {
  const mergedOptions = options ?? {}
  const pagination = mergedOptions.pagination ?? {}

  const curPage = ref(pagination.current ?? 1)
  const pageSize = ref(pagination.pageSize ?? 10)
  const loading = ref(false)
  const total = ref(0)
  const errorState = ref<unknown>(null)
  const dataSource = ref<ItemType[]>([]) as Ref<ItemType[]>

  const initialFilters = filters ? cloneDeep(unref(filters) ?? ({} as FilterOption)) : null

  let suppressWatch = false

  const runWithSuppress = async (runner: () => Promise<Response | undefined>) => {
    suppressWatch = true
    const result = await runner()
    await nextTick()
    suppressWatch = false
    return result
  }

  const loadData = async (page = curPage.value, extra: Record<string, any> = {}) => {
    const executor = resolveRequest<Response, Record<string, any>>(request)
    const filterState = filters ? unref(filters) : undefined

    const params =
      mergedOptions.buildParams?.({
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
      const response = await executor(params)
      const { items, total: resolvedTotal } =
        mergedOptions.transform?.(response) ?? defaultTransform<ItemType, Response>(response)

      dataSource.value = items
      total.value = Number.isFinite(resolvedTotal) ? Number(resolvedTotal) : items.length

      mergedOptions.onSuccess?.({
        response,
        items,
        total: total.value,
        params,
        filters: filterState as FilterOption | undefined
      })

      return response
    } catch (error) {
      errorState.value = error
      mergedOptions.onError?.(error)
      if (mergedOptions.throwOnError) {
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
      if (mergedOptions.autoWatchPagination === false) {
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
      if (mergedOptions.autoWatchPagination === false) {
        void loadData(curPage.value)
      }
      return
    }
    void runWithSuppress(async () => {
      pageSize.value = size
      return undefined
    })
  }

  const reset = () => {
    if (!filters) return

    if (mergedOptions.resetFilters) {
      mergedOptions.resetFilters(filters)
    } else {
      if (initialFilters) {
        filters.value = cloneDeep(initialFilters) as FilterOption
      } else {
        filters.value = {} as FilterOption
      }
    }

    return loadData()
  }

  if (mergedOptions.autoWatchPagination !== false) {
    watch([curPage, pageSize], () => {
      if (suppressWatch) return
      void loadData(curPage.value)
    })
  }

  if (mergedOptions.immediate) {
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

