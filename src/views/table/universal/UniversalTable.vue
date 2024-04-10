<template>
  <div>
    <div v-pre>{{ value }}</div>
    <a-input v-model:value="value"></a-input>
  </div>
</template>

<script lang="ts" setup>
const value = ref('{{test}}')
</script>
