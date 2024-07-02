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
  padding: 20px;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgb(0 0 0 / 10%);

  p {
    margin-bottom: 20px;
    color: #90a924;
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
