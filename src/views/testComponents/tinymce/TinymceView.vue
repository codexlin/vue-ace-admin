<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()
const value = ref('hello world')
const tinymce = ref<any>(null)
const handleSet = () => {
  tinymce.value?.handleSetContent('设置新内容')
}
</script>
<template>
  <div class="p-4">
    <a-button @click="handleSet">设置内容</a-button>
    <TinymceEditor ref="tinymce" v-model="value" :darkMode="appStore.isDarkMode" />
  </div>
</template>
