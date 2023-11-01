<template>
  <div>通用</div>
  <a-input v-model:value="value"></a-input>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
</script>

<style scoped></style>
