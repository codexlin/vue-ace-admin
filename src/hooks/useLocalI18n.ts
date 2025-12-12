import { useI18n } from 'vue-i18n'

import { useAppStore } from '@/stores/modules/app'

/**
 *
 * @param prefix 前缀
 */
export default function useLocalI18n(prefix?: string) {
  const i18n = useI18n()

  // 根据当前的语言环境来翻译
  function tt(text: string) {
    if (!text) return ''
    const i18nText = prefix ? `${prefix}.${text}` : text
    // 如果找不到对应的翻译，则返回原始的 text
    return i18n.te(i18nText) ? i18n.t(i18nText) : i18nText
  }

  // 监听语言切换
  function watchSwitchLang(...cbs: any[]) {
    const useAppConfig = useAppStore()
    watch(
      () => useAppConfig.getLanguage,
      () => {
        // 根据当前语言做点什么
        cbs.forEach((cb) => cb(useAppConfig.getLanguage))
      }
    )
  }

  function changeLanguage(lang: string) {
    const useAppConfig = useAppStore()
    i18n.locale.value = lang
    useAppConfig.appConfig.defaultLanguage = lang
  }

  function getLanguage() {
    const useAppConfig = useAppStore()
    return computed(() => useAppConfig.getLanguage)
  }

  return {
    tt,
    watchSwitchLang,
    changeLanguage,
    getLanguage
  }
}
