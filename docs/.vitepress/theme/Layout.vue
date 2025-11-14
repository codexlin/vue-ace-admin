<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ConfigProvider } from 'ant-design-vue'
import { theme } from 'ant-design-vue'

const { darkAlgorithm, defaultAlgorithm } = theme

// 当前是否为暗色主题
const isDark = ref(false)

// 同步设置 data-theme 属性，用于组件库自定义样式（如 ProTable 斑马纹）
const updateDataTheme = () => {
  if (typeof document !== 'undefined') {
    const html = document.documentElement
    const darkMode = html.classList.contains('dark')
    isDark.value = darkMode
    html.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }
}

// Ant Design Vue 主题配置
const antdTheme = computed(() => ({
  algorithm: isDark.value ? darkAlgorithm : defaultAlgorithm
}))

// 监听 html 元素的 class 变化
onMounted(() => {
  if (typeof document !== 'undefined') {
    // 初始化
    updateDataTheme()

    // 使用 MutationObserver 监听 class 变化
    const observer = new MutationObserver(() => {
      updateDataTheme()
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // 清理
    onUnmounted(() => {
      observer.disconnect()
    })
  }
})
</script>

<template>
  <ConfigProvider :theme="antdTheme">
    <DefaultTheme.Layout />
  </ConfigProvider>
</template>

