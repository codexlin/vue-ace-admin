<template>
  <div>
    <div>通用子</div>
    <div>
      <a-input v-model:value="value" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const value = ref('')
</script>
