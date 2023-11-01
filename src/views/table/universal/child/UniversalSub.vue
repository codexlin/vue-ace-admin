<template>
  <div>通用子</div>
  <div>
    <a-input v-model:value="value"></a-input>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
</script>

<style scoped></style>
