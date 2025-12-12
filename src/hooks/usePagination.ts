import { ref } from 'vue'

export interface UsePaginationOptions {
  pageSize?: number
  total?: number
}

export function usePagination(options: UsePaginationOptions = {}) {
  const current = ref(1)
  const pageSize = ref(options.pageSize ?? 10)
  const total = ref(options.total ?? 0)

  const onChange = (page: number, size?: number) => {
    current.value = page
    if (typeof size === 'number') pageSize.value = size
  }

  const reset = () => {
    current.value = 1
  }

  return { current, pageSize, total, onChange, reset }
}

export type UsePaginationReturn = ReturnType<typeof usePagination>
