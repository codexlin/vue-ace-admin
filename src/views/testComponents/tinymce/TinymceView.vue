<script lang="ts" setup>
import TinymceEditor from '@/components/tinymce/TinymceEditor.vue'
const value = ref(
  'Thanks for supporting TinyMCE! We hope it helps you and your users create great content.\n' +
    'All the best from the TinyMCE team.'
)
const getContent = () => {
  console.log(tinymce.value?.handleGetContent())
}
const tinymce = ref<InstanceType<typeof TinymceEditor> | null>(null)
</script>
<template>
  <div>
    <a-button @click="getContent">Get Content</a-button>
    <TinymceEditor ref="tinymce" v-model="value" />
  </div>
</template>
