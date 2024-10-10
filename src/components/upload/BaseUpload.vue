<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import type { UploadFile, UploadChangeParam } from 'ant-design-vue/es/upload/interface'

// 文件列表类型为 UploadFile 的数组
const fileList = ref<UploadFile[]>([])
const uploadProgress = ref<number>(0)
const chunkSize = 5 * 1024 * 1024 // 5MB

// 上传文件处理函数
const handleUpload = async (options: UploadChangeParam) => {
  const { file } = options

  // 类型检查确保 file 是 RcFile 或 Blob
  if (!(file instanceof Blob)) {
    console.error('File is not a Blob or RcFile.')
    return
  }

  const totalChunks = Math.ceil(file.size / chunkSize)
  let currentChunk = 0

  // 上传单个文件分片
  const uploadChunk = async (start: number, end: number) => {
    const chunk = file.slice(start, end)
    const formData = new FormData()
    formData.append('file', chunk)
    formData.append('filename', file.name)
    formData.append('chunk', String(currentChunk))
    formData.append('totalChunks', String(totalChunks))

    try {
      await axios.post('/upload', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            uploadProgress.value = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          }
        }
      })
      currentChunk++
      if (currentChunk < totalChunks) {
        await uploadChunk(currentChunk * chunkSize, (currentChunk + 1) * chunkSize)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  await uploadChunk(0, chunkSize)
}

// 移除文件处理函数
const handleRemove = (file: UploadFile) => {
  fileList.value = fileList.value.filter((item) => item.uid !== file.uid)
}

// 文件列表变化处理函数
const handleChange = (info: UploadChangeParam) => {
  fileList.value = info.fileList
}
</script>

<template>
  <div>
    <a-upload :customRequest="handleUpload" :fileList="fileList" :onRemove="handleRemove" :onChange="handleChange">
      <a-button> <a-icon type="upload" /> Click to Upload </a-button>
    </a-upload>
    <a-progress :percent="uploadProgress" />
  </div>
</template>

<style scoped lang="scss"></style>
