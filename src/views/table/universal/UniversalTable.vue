<script lang="ts" setup>
const value = ref(
  'Thanks for supporting TinyMCE! We hope it helps you and your users create great content.\n' +
    'All the best from the TinyMCE team.'
)
</script>
<template>
  <div>
    <a-input v-model:value="value" />
    <AiChat />
  </div>
</template>
