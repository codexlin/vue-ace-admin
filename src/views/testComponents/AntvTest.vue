<template>
  <div class="p-4">
    <h1 class="text-xl mb-4">@ace-admin/ui 组件测试页面</h1>

    <div class="card">
      <h2 class="text-lg font-semibold mb-2">ProButton</h2>
      <div class="flex items-center gap-2">
        <ProButton>默认按钮</ProButton>
        <ProButton type="primary">主要按钮</ProButton>
        <ProButton type="dashed">虚线按钮</ProButton>
        <ProButton type="link">链接按钮</ProButton>
        <ProButton type="text">文本按钮</ProButton>
      </div>
    </div>

    <div class="card mt-4">
      <h2 class="text-lg font-semibold mb-2">ProInput</h2>
      <div class="w-1/3">
        <ProInput v-model:value="inputValue" placeholder="请输入..." />
        <p class="mt-2">输入的值: {{ inputValue }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ProButton, ProInput } from '@ace-admin/ui'

const inputValue = ref('')
</script>

<style scoped>
.card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 10%),
    0 1px 2px 0 rgb(0 0 0 / 6%);
}
</style>
