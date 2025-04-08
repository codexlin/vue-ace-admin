<template>
  <div class="default-component">
    <h1 class="default-component__title">欢迎来到默认组件😊！</h1>
    <p>
      <a-typography-text type="secondary">您还需要按照以下说明在代码中添加您的组件😊！</a-typography-text>
    </p>
    <p class="default-component__description"
      >该组件完整路径为:<a-typography-text code>{{ `src/views${fullPath}/${name}.vue` }}</a-typography-text
      >,请添加您的组件 😊！</p
    >
    <p class="default-component__description"
      >请在国际化目录: <a-typography-text code>src/locales/lang</a-typography-text>中配置{{
        meta.title
      }}的中文和英文名称😊！</p
    >
  </div>
</template>

<script setup lang="ts">
const { name, fullPath, meta } = useRoute()
</script>

<style scoped lang="scss">
.default-component {
  padding: 20px;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgb(0 0 0 / 10%);

  &__description {
    margin-bottom: 20px;
    color: #90a924;
  }

  &__title {
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
