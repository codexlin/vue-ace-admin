import { customRef, type Ref } from 'vue'

/**
 * 防抖 ref
 * @param value 初始值
 * @param delay 延迟时间（毫秒）
 * @returns 防抖的 ref
 */
export function useDebouncedRef<T>(value: T, delay = 200): Ref<T> {
  let timer: ReturnType<typeof setTimeout> | 0 = 0
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}
