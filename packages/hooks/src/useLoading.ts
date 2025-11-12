import { ref } from 'vue'

/**
 * 加载状态管理 Hook
 * @param initValue 初始加载状态
 * @returns 加载状态和相关方法
 */
export function useLoading(initValue = false) {
  const loading = ref(initValue)
  const setLoading = (value: boolean) => {
    loading.value = value
  }
  const toggle = () => {
    loading.value = !loading.value
  }
  return {
    loading,
    setLoading,
    toggle
  }
}

export type UseLoading = ReturnType<typeof useLoading>
