import { getCurrentInstance } from 'vue'

export function useEmitOrDefault<T = any>(eventName: string, emitFn: (payload?: T) => void, fallbackFn: () => void) {
  // 可访问当前组件实例（proxy、props、attrs、slots）
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
