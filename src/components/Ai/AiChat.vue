<template>
  <div>
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
              placeholder="请输入您要咨询的产品信息"
              @press-enter="sendMessage"
            />
            <a-button type="primary" @click="sendMessage">{{ tt('common.Send') }}</a-button>
          </div>
        </div>
        <p style="font-size: 12px; color: #656464">Copyright © All Rights Reserved Ace Lin.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BulbOutlined, CloseOutlined } from '@ant-design/icons-vue'
import hljs from 'highlight.js'
import { marked } from 'marked'

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
const messageList = ref([
  {
    type: 'ai',
    content:
      'こんにちは！私はHOUSEI製品紹介アシスタントです。HOUSEIについて答えることが出来ます。何かお手伝いできることはありますか？'
  }
])
const tips = ['🔍NOVOとは何ですか？', '😎Pixtockとは何ですか？']
const inputMessage = ref('')
const tipFlag = ref(true)
const inputRef = ref(null)
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
    const chatBody = document.querySelector('.chat-body')
    if (chatBody) {
      messageList.value.push({ type: 'user', content: inputMessage.value })
      chatBody.scrollTop = chatBody.scrollHeight
      const urlPix = '/system/tinymce/callAiStreamKnowledgeChat'
      messageList.value.push({ type: 'ai', content: '' })
      const cb = (text) => {
        messageList.value.at(-1).content += text
        chatBody.scrollTop = chatBody.scrollHeight
      }
      inputMessage.value = ''
      await useFetch({ url: urlPix, method: 'POST', data: { command, modelType: '0', text: '' }, cb })
      messageList.value.at(-1).content = handleResults(messageList.value.at(-1).content)
      await nextTick()
      chatBody.scrollTop = chatBody.scrollHeight
    }
  } catch (e) {
    messageList.value.at(-1).content = '出现了一些错误，请稍后再试。'
  }
}
const showTips = () => {
  tipFlag.value = !tipFlag.value
}
</script>

<style scoped lang="scss">
@import './index';
</style>
