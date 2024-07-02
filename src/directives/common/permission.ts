import type { App } from 'vue'
import { useUserStore } from '@/stores/modules/user'

/**
 * @param {string|string[]} bind.value 权限值
 * @param app
 */

export default function permission(app: App) {
  app.directive('permission', (el, bind) => {
    // 是否需要全部满足
    const all = bind.arg

    // 获取当前用户权限
    const roles = useUserStore().userInfo?.permissions || []

    if (!roles || !bind.value) {
      throw new Error(`roles 或 bind.value 不能为空`)
    }

    // 对字符串的兼容
    const value = bind.value instanceof Array ? bind.value : [bind.value]

    const hasPermission = value.filter((role: string) => roles.includes(role))

    if (all ? value.length !== hasPermission.length : !hasPermission.length) {
      // el.parentNode?.removeChild(el) || (el.style.display = 'none')
      if (el.tagName === 'A') {
        el.style.pointerEvents = 'none'
      }
      el.setAttribute('disabled', true) // 设置元素为 disabled
    }
  })
}
