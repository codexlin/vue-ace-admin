<template>
  <div class="default-component">
    <h1>欢迎来到默认组件</h1>
    <p>请根据组件路径：{{ currentPath }} 添加该组件 😊！</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currentPath = ref<string>('')

onMounted(() => {
  // 获取当前页面路径
  currentPath.value = window.location.pathname
})
</script>

<style scoped lang="scss">
.default-component {
  text-align: center;
  margin: 20px auto;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  p {
    color: #90a924;
    margin-bottom: 20px;
  }
  h1 {
    color: #da2727;
    animation: pulse 2s infinite alternate;
  }
}

@keyframes pulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}
</style>
