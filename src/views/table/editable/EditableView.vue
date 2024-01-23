<template>
  <div>
    <a-input v-model:value="test"></a-input>
    <a-date-picker></a-date-picker>
  </div>
</template>

<script setup lang="ts">
const test = ref('')
</script>

<style scoped></style>
