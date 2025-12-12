import { createI18n } from 'vue-i18n'

import type { App } from 'vue'

import enUS from './lang/enUS'
import zhCN from './lang/zhCN'

import { useAppStore } from '@/stores/modules/app'

const messages = { enUS, zhCN }

export let i18n: any

export default function setupI18n(app: App) {
  const useAppConfig = useAppStore()
  i18n = createI18n<false>({
    legacy: false,
    locale: useAppConfig.getLanguage,
    messages
  })
  app.use(i18n)
}
