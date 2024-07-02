<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-14 21:29:57
 * @Description:
-->
<script lang="ts" setup>
import { TranslationOutlined } from '@ant-design/icons-vue'
import useLocalI18n from '@/hooks/useLocalI18n'

const { changeLanguage, getLanguage } = useLocalI18n()
const language = getLanguage()
const handleClick = ({ key }: { key: string }) => changeLanguage(key)
</script>
<template>
  <a-dropdown placement="bottom" arrow>
    <div class="header-avatar">
      <TranslationOutlined />
    </div>
    <template #overlay>
      <a-menu @click="(e: any) => handleClick(e)">
        <a-menu-item key="zh-cn" :disabled="language === 'zh-cn'">简体中文</a-menu-item>
        <a-menu-item key="en" :disabled="language === 'en'">English</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
