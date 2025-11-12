import { getCurrentInstance } from 'vue'

/**
 * 事件发射或执行默认行为
 * @param eventName 事件名称
 * @param emitFn 发射函数
 * @param fallbackFn 默认行为函数
 * @returns 发射或默认行为函数
 */
export function useEmitOrDefault<T = any>(
  eventName: string,
  emitFn: (payload?: T) => void,
  fallbackFn: () => void
) {
  const instance = getCurrentInstance()

  const emitOrDefault = (payload?: T) => {
    if (!instance?.vnode?.props) {
      fallbackFn()
      return
    }

    const camel = eventName.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    const key = 'on' + camel.charAt(0).toUpperCase() + camel.slice(1)

    if (key in instance.vnode.props) {
      emitFn(payload)
    } else {
      fallbackFn()
    }
  }

  return { emitOrDefault }
}

export type UseEmitOrDefault = ReturnType<typeof useEmitOrDefault>
