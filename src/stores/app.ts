import variables from '@/styles/variables.module.scss'
import { theme } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
/**
 * app 配置 开启持久化
 */
export const useAppStore = defineStore('app', () => {
  const themeName = ref('red') // 主题名称
  const darkMode = ref('light') // 颜色模式
  const darkModeComp = computed(() => {
    document.documentElement.setAttribute('data-dark', darkMode.value)
    return darkMode.value
  })
  const themeConfig = computed(() => {
    document.documentElement.setAttribute('data-theme', themeName.value)
    // 主题配置
    return {
      token: {
        colorPrimary: variables[themeName.value] || '#27ba9b',
        colorSuccess: '#1dc779',
        colorWarning: '#ffb302',
        colorError: '#cf4444',
        colorInfo: variables[themeName.value] || '#27ba9b',
        wireframe: true
      },
      algorithm: darkMode.value === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm
    }
  })
  const setThemeName = (value: string) => {
    themeName.value = value
  }
  const toggleDarkMode = () => {
    darkMode.value = darkMode.value === 'light' ? 'dark' : 'light'
  }
  return { themeName, themeConfig, darkMode, darkModeComp, setThemeName, toggleDarkMode }
})
