<template>
  <a-card>
    <div class="chat-container">
      <!-- <div class="chat-header"></div> -->
      <div class="chat-body">
        <div class="chat-message">
          <template v-for="(message, index) in messageList" :key="index">
            <div :class="message.type === 'user' ? 'chat-user-content' : 'chat-ai-content'">
              <div v-if="message.type === 'ai' && message.content === ''">loading...</div>
              <div v-else v-html="message.content" />
            </div>
          </template>
        </div>
      </div>

      <div class="chat-footer">
        <div v-if="!tipFlag" class="chat-input-tips">
          <template v-for="tip in tips" :key="tip">
            <p @click="setMessage(tip)">{{ tip }}</p>
          </template>
        </div>
        <div style="width: 100%">
          <div class="chat-input-container">
            <a-button type="link" @click="showTips">
              <bulb-outlined v-if="tipFlag" />
              <close-outlined v-else />
            </a-button>
            <a-input
              ref="inputRef"
              v-model:value="inputMessage"
              placeholder="请输入消息进行对话"
              @press-enter="sendMessage"
            />
            <a-button type="primary" @click="sendMessage">发送</a-button>
          </div>
        </div>
        <p style="font-size: 12px; color: #656464">Copyright © All Rights Reserved Ace Lin.</p>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { BulbOutlined, CloseOutlined } from '@ant-design/icons-vue'
import hljs from 'highlight.js'
import { marked } from 'marked'

// import { Request } from '@/utils/axios'

async function useFetch({ data, cb, url, signal = null }) {
  const body = JSON.stringify(data)
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body,
    signal // 将信号传递给 fetch 用于cancel请求
  })

  // not 200
  if (!response.ok) {
    throw new Error('网络错误or其他错误' + response.statusText)
  }

  // 处理流式响应
  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let partialChunk = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    partialChunk += decoder.decode(value, { stream: true })
    let lines = partialChunk.split('\n')
    partialChunk = lines.pop() // 保留最后一个未完整的行，继续拼接
    lines = lines.filter(Boolean).map((line) => line.replace('data:', ''))
    console.log('lines', lines)
    for (const line of lines) {
      try {
        // 根据你的需求处理不同类型的数据
        // const res = JSON.parse(line)
        cb(line)
      } catch (error) {
        console.error('解析错误:', error)
      }
    }
  }
}
function handleResults(text: string) {
  const markdownLinkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g

  // 将 Markdown 转换为 HTML
  return marked.parse(text.replace(markdownLinkPattern, '<a  style="color:blue" href="$2" target="_blank">$1</a>'), {
    highlight: function (code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    }
  })
}

interface Message {
  type: 'ai' | 'user'
  content: string
}

const messageList = ref<Message[]>([
  {
    type: 'ai',
    content: '我是AceLin，很高兴为您服务。请问您有什么需要帮助的吗？'
  }
])

const tips = ['vue3中的computed和watch的区别是什么？', '帮我写一篇100字的日记']
const inputMessage = ref<string>('')
const tipFlag = ref<boolean>(true)
const inputRef = ref<HTMLElement | null>(null)

const toggle = () => {
  tipFlag.value = !tipFlag.value
}

const focusInput = () => {
  inputRef.value?.focus()
}

const setMessage = (text: string) => {
  inputMessage.value = text
  focusInput()
  toggle()
}

const sendMessage = async () => {
  try {
    if (!inputMessage.value) return focusInput()

    const command = inputMessage.value
    const chatBody = document.querySelector('.chat-body') as HTMLElement
    if (chatBody) {
      messageList.value.push({ type: 'user', content: inputMessage.value })
      chatBody.scrollTop = chatBody.scrollHeight
      const urlPix = '/api/ai/chat'
      messageList.value.push({ type: 'ai', content: '' })
      const cb = (text: string) => {
        messageList.value.at(-1)!.content += text
        chatBody.scrollTop = chatBody.scrollHeight
      }
      inputMessage.value = ''
      // todo 这里应该是异步请求
      const onData = (data: string) => {
        messageList.value.at(-1)!.content += data
        chatBody.scrollTop = chatBody.scrollHeight
        console.log(data)
      }
      const data = {
        question: command
      }
      // await new Request().getTextStream('/ai/chat', data, onData)
      await useFetch({ url: urlPix, data, cb: onData })
      messageList.value.at(-1)!.content = handleResults(messageList.value.at(-1)!.content)
      await nextTick()
      chatBody.scrollTop = chatBody.scrollHeight
    }
  } catch (e) {
    messageList.value.at(-1)!.content = '出现了一些错误，请稍后再试。'
  }
}

const showTips = () => {
  tipFlag.value = !tipFlag.value
}
</script>

<style scoped lang="scss">
@import './index';
</style>
