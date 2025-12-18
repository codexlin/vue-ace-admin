import { createI18n } from 'vue-i18n'
import type { App } from 'vue'
import { useAppStore } from '@/stores/modules/app'

// 语言包映射表（按需加载）
const localeModules: Record<string, () => Promise<{ default: any }>> = {
  zhCN: () => import('./lang/zhCN'),
  enUS: () => import('./lang/enUS')
}

export let i18n: any

/**
 * 加载语言包
 * @param locale 语言标识
 */
async function loadLocaleMessages(locale: string) {
  if (i18n.global.availableLocales.includes(locale)) {
    return
  }

  const messages = await localeModules[locale]()
  i18n.global.setLocaleMessage(locale, messages.default)
}

/**
 * 设置语言
 * @param locale 语言标识
 */
export async function setI18nLanguage(locale: string) {
  await loadLocaleMessages(locale)
  i18n.global.locale.value = locale
  document.querySelector('html')?.setAttribute('lang', locale)
}

/**
 * 初始化国际化
 */
export default async function setupI18n(app: App) {
  const useAppConfig = useAppStore()
  const defaultLocale = useAppConfig.getLanguage

  // 只加载默认语言包
  const defaultMessages = await localeModules[defaultLocale]()

  i18n = createI18n<false>({
    legacy: false,
    locale: defaultLocale,
    fallbackLocale: 'zhCN',
    messages: {
      [defaultLocale]: defaultMessages.default
    }
  })

  app.use(i18n)
}
