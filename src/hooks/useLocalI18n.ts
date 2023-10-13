import { useAppStore } from '@/stores/app'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

export default function useLocalI18n() {
  // 根据当前的语言环境来翻译
  function tt(text: string) {
    if (!text) return ''

    const i18n = useI18n()
    // 如果找不到对应的翻译，则返回原始的 text
    return i18n.te(text) ? i18n.t(text) : text
  }

  // 监听语言切换
  function watchSwitchLang(...cbs: any[]) {
    const useAppConfig = useAppStore()

    watch(
      () => useAppConfig.getLanguage,
      () => {
        cbs.forEach((cb) => cb(useAppConfig.getLanguage))
      }
    )
  }

  return {
    tt,
    watchSwitchLang
  }
}
