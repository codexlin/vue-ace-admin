<script setup lang="ts"></script>

<template>
  <div class="error-page">
    <a-result
      class="error-page__result"
      status="404"
      title="404"
      sub-title="Sorry, the page you visited does not exist."
    >
      <template #extra>
        <RouterLink to="/">
          <a-button type="primary" class="error-page__button">Back Home</a-button>
        </RouterLink>
      </template>
    </a-result>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  display: flex;
  height: 100vh;
  background: #0d120a;

  &__result {
    margin: auto;
  }

  &__button {
    /* 如果需要额外样式，可以在这里添加 */
  }
}
</style>
