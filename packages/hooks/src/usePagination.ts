import { computed, ref, unref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'

type MaybeRef<T> = Ref<T> | ComputedRef<T>

export type PaginateStrategy<T> = (list: T[], page: number, pageSize: number) => T[]

export interface UsePaginationOptions<T> {
  /**
   * 初始页码，默认 1
   */
  currentPage?: number
  /**
   * 每页条数，默认 10
   */
  pageSize?: number
  /**
   * 自定义分页策略
   */
  paginate?: PaginateStrategy<T>
}

export interface UsePaginationResult<T> {
  getPaginationList: ComputedRef<T[]>
  getTotal: ComputedRef<number>
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  currentPage: Ref<number>
  pageSize: Ref<number>
}

const defaultPaginate: PaginateStrategy<any> = (list, page, pageSize) => {
  const start = (page - 1) * pageSize
  return list.slice(start, start + pageSize)
}

export function usePagination<T = any>(
  list: MaybeRef<T[]>,
  options: UsePaginationOptions<T> = {}
): UsePaginationResult<T> {
  const currentPage = ref(options.currentPage ?? 1)
  const pageSize = ref(options.pageSize ?? 10)
  const paginate = options.paginate ?? defaultPaginate

  const sourceList = computed(() => unref(list) ?? [])

  const getTotal = computed(() => sourceList.value.length)

  const getPaginationList = computed(() => {
    const items = sourceList.value
    const total = items.length
    if (!total) {
      return []
    }
    const page = Math.max(1, Math.min(currentPage.value, Math.ceil(total / pageSize.value) || 1))
    return paginate(items, page, pageSize.value)
  })

  const setCurrentPage = (page: number) => {
    const next = Math.floor(page)
    if (Number.isFinite(next) && next > 0) {
      currentPage.value = next
    }
  }

  const setPageSize = (size: number) => {
    const next = Math.floor(size)
    if (Number.isFinite(next) && next > 0) {
      pageSize.value = next
    }
  }

  watch(
    [sourceList, pageSize],
    () => {
      const total = getTotal.value
      const maxPage = Math.max(1, Math.ceil(total / pageSize.value) || 1)
      currentPage.value = Math.min(Math.max(currentPage.value, 1), maxPage)
    },
    { immediate: true }
  )

  return {
    getPaginationList,
    getTotal,
    setCurrentPage,
    setPageSize,
    currentPage,
    pageSize
  }
}

