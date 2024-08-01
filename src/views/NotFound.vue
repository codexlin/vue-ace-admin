<script setup lang="ts"></script>

<template>
  <div class="wrapper">
    <a-result class="result" status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
      <template #extra>
        <RouterLink to="/">
          <a-button type="primary">Back Home</a-button>
        </RouterLink>
      </template>
    </a-result>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  height: 100vh;
  background: #0d120a;

  .result {
    margin: auto;
  }
}
</style>
