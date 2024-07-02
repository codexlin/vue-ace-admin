<template>
  <div>
    <a-input v-model:value="test" />
    <a-date-picker />
  </div>
</template>

<script setup lang="ts">
const test = ref('')
</script>

<style scoped></style>
