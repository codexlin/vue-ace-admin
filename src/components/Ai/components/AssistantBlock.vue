<script setup lang="ts">
import { computed } from 'vue'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css' // 选择一个样式
const States = {
  text: 0, // 文本状态
  codeStartSm: 1, // 小代码块状态
  codeStartBig: 2 // 大代码块状态
}

function isInCode(text: string) {
  let state = States.text
  let source = text
  let inStart = true // 是否处于文本开始状态，即还没有消费过文本
  while (source) {
    // 当文本被解析消费完后，就是个空字符串了，就能跳出循环
    let char = source.charAt(0) // 取第 0 个字
    switch (state) {
      case States.text:
        if (/^\n?```/.test(source)) {
          // 以 ``` 或者 \n``` 开头。表示大代码块开始。
          // 一般情况下，代码块前面都需要换行。但是如果是在文本的开头，就不需要换行。
          if (inStart || source.startsWith('\n')) {
            state = States.codeStartBig
          }
          source = source.replace(/^\n?```/, '')
        } else if (char === '\\') {
          // 遇到转义符，跳过下一个字符
          source = source.slice(2)
        } else if (char === '`') {
          // 以 ` 开头。表示小代码块开始。
          state = States.codeStartSm
          source = source.slice(1)
        } else {
          // 其他情况，直接消费当前字符
          source = source.slice(1)
        }
        inStart = false
        break
      case States.codeStartSm:
        if (char === '`') {
          // 遇到第二个 `，表示代码块结束
          state = States.text
          source = source.slice(1)
        } else if (char === '\\') {
          // 遇到转义符，跳过下一个字符
          source = source.slice(2)
        } else {
          // 其他情况，直接消费当前字符
          source = source.slice(1)
        }
        break
      case States.codeStartBig:
        if (/^\n```/.test(source)) {
          // 遇到第二个 ```，表示代码块结束
          state = States.text
          source = source.replace(/^\n```/, '')
        } else {
          // 其他情况，直接消费当前字符
          source = source.slice(1)
        }
        break
    }
  }
  return state !== States.text
}

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
      marked.parse(text, {
        highlight: function (code, language) {
          console.log('highlight', code, language)
          try {
            if (language) {
              return hljs.highlight(code, { language }).value
            } else {
              return hljs.highlightAuto(code).value
            }
          } catch (error) {
            return code
          }
        },
        gfmtrue: true,
        breaks: true
      }) as string
    )
  }

  // 光标元素，可以用 css 美化成你想要的样子
  const cursor = '<span class="cursor"></span>'
  if (props.showCursor) {
    // 判断 AI 正在回的消息是否有未闭合的代码块。
    const inCode = isInCode(props.text)
    if (inCode) {
      // 有未闭合的代码块，不显示光标
      return trans(props.text)
    } else {
      // 没有未闭合的代码块，将光标元素追加到最后。
      return trans(props.text + cursor)
    }
  } else {
    // 父组件明确不显示光标
    return trans(props.text)
  }
})
</script>

<template>
  <div class="markdown" v-html="html" />
</template>

<style lang="scss">
@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.markdown pre {
  width: 100%;
  padding: 4px;
  margin-top: 4px;
  overflow-x: auto;
  color: white;
  background: #282c34;
}

.markdown code {
  width: 100%;
}

/** 控制段落间的上下边距 **/
.markdown p {
  margin: 0;
}

.markdown p:first-child {
  margin-top: 0;
}

/** 小代码块样式，对应 markdown 的 `code` **/

.markdown :not(pre) > code {
  padding: 2px 0.25rem;
  color: #e06c75; /* text-[#e06c75] */
  background-color: #282c34; /* bg-[#282c34] */
  border-radius: 0.375rem; /* rounded-md */
}
/** 列表样式 **/
.markdown ol {
  padding-left: 40px;
  list-style-type: decimal;
}

.markdown ul {
  padding-left: 40px;
  list-style-type: disc;
}

/** 光标样式 **/
.markdown .cursor {
  display: inline-block;
  width: 2px;
  height: 20px;
  margin-left: 2px;
  vertical-align: sub;
  background: red;
  animation: blink 1.2s step-end infinite;
} /** 设置代码块样式 **/
</style>
