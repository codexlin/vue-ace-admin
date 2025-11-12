import { getCurrentInstance } from 'vue'

/**
 * kebab-case 转 camelCase
 * e.g. custom-click => customClick
 */
function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

/**
 * 检查是否有监听某个自定义事件
 * @param eventName - 自定义事件名，支持 kebab-case（如 custom-click）
 * @returns () => boolean
 */
export function useHasEventListener<T extends string>(eventName: T): () => boolean {
  const instance = getCurrentInstance()

  return () => {
    if (!instance?.vnode?.props) return false

    const camel = toCamelCase(eventName)
    const key = 'on' + camel.charAt(0).toUpperCase() + camel.slice(1)

    return key in instance.vnode.props
  }
}

export type UseHasEventListener = ReturnType<typeof useHasEventListener>
