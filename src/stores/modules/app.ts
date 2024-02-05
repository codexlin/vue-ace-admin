/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-14 21:29:57
 * @Description:
 */
import systemConfig from '@/config/system/index'
import type { MenuTheme } from 'ant-design-vue'
import { theme } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'

/**
 * app 配置
 */
export const useAppStore = defineStore('app', () => {
  const { darkAlgorithm, compactAlgorithm, defaultAlgorithm } = theme
  const appConfig = ref({
    ...cloneDeep(systemConfig)
  })
  const collapsed = ref<boolean>(false)

  const darkMode = ref<MenuTheme>('light') // 颜色模式
  const darkModeComp = computed(() => {
    document.documentElement.setAttribute('data-theme', darkMode.value)
    return darkMode.value
  })
  const themeConfig = computed(() => {
    document.documentElement.style.setProperty('--primary', appConfig.value.token.colorPrimary)
    let algorithm = []
    if (appConfig.value.compactAlgorithm) {
      algorithm = darkMode.value === 'light' ? [defaultAlgorithm, compactAlgorithm] : [darkAlgorithm, compactAlgorithm]
    } else {
      algorithm = darkMode.value === 'light' ? [defaultAlgorithm] : [darkAlgorithm]
    }
    // 主题配置
    return {
      token: { ...appConfig.value.token, colorInfo: appConfig.value.token.colorPrimary || '#8E56B7' },
      algorithm
    }
  })

  const getLanguage = computed(() => appConfig.value.defaultLanguage)
  const getDirection = computed(() => appConfig.value.direction)
  const getLayout = computed<string>(() => appConfig.value.layout)

  const setThemeName = (value: string) => {
    appConfig.value.token.colorPrimary = value
  }

  const setFontSize = (value: number) => {
    appConfig.value.token.fontSize = value
  }
  const toggleDarkMode = () => {
    darkMode.value = darkMode.value === 'light' ? 'dark' : 'light'
  }

  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  function resetDefault() {
    // appConfig.value.token = cloneDeep(systemConfig.token)
    // appConfig.value.compactAlgorithm = systemConfig.compactAlgorithm
    appConfig.value = {
      ...cloneDeep(systemConfig)
    }
    console.log('resetDefault', appConfig.value)
  }

  return {
    getLayout,
    getDirection,
    toggleCollapsed,
    collapsed,
    getLanguage,
    themeConfig,
    darkMode,
    darkModeComp,
    setThemeName,
    appConfig,
    setFontSize,
    toggleDarkMode,
    resetDefault
  }
})
