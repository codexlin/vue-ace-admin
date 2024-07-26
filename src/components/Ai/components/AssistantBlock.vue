<script setup lang="ts">
import { computed } from 'vue'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css' // 选择一个样式

const props = defineProps({
  // 输入的 markdown 文本
  text: {
    type: String,
    default: ''
  },
  // 是否需要显示光标？比如在消息流结束后是不需要显示光标的
  showCursor: {
    type: Boolean,
    default: true
  }
})

// 计算最终要显示的 html 文本
const html = computed(() => {
  // 将 markdown 转为 html
  function trans(text: string) {
    return DOMPurify.sanitize(
      marked(text, {
        highlight: function (code: any, language: any) {
          const validLanguage = !!(language && hljs.getLanguage(language))
          const highlighted = validLanguage ? hljs.highlight(code, { language }).value : hljs.highlightAuto(code).value
          return `<pre class='clearfix'><code class='${language} hljs'>${highlighted}</code></pre>\n`
        }
      }) as string
    )
  }

  return trans(props.text)
})
</script>

<template>
  <div class="markdown" v-html="html" />
</template>
