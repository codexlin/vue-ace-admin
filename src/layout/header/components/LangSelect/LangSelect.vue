<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-14 21:29:57
 * @Description: 
-->
<script lang="ts" setup>
import { useAppStore } from '@/stores/modules/app'
import { TranslationOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'

const useAppConfig = useAppStore()
const language = computed(() => useAppConfig.getLanguage)
const i18n = useI18n()

function handleSetLanguage(item: any) {
  i18n.locale.value = item.key
  useAppConfig.appConfig.defaultLanguage = item.key
}
</script>
<template>
  <a-dropdown placement="bottom" arrow>
    <div class="header-avatar">
      <TranslationOutlined />
    </div>
    <template #overlay>
      <a-menu @click="handleSetLanguage">
        <a-menu-item key="zh-cn" :disabled="language === 'zh-cn'">简体中文</a-menu-item>
        <a-menu-item key="en" :disabled="language === 'en'">English</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
