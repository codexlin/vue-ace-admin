<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-14 21:29:57
 * @Description: 
-->
<script lang="ts" setup>
import useLocalI18n from '@/hooks/useLocalI18n'
import { TranslationOutlined } from '@ant-design/icons-vue'
const { changeLanguage, getLanguage } = useLocalI18n()
const language = getLanguage()
</script>
<template>
  <a-dropdown placement="bottom" arrow>
    <div class="header-avatar">
      <TranslationOutlined />
    </div>
    <template #overlay>
      <a-menu @click="(item) => changeLanguage(item.key as string)">
        <a-menu-item key="zh-cn" :disabled="language === 'zh-cn'">简体中文</a-menu-item>
        <a-menu-item key="en" :disabled="language === 'en'">English</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
