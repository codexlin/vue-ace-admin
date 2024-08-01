<script setup lang="ts">
import axios from 'axios'
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'

const fileList = ref([])
const uploadProgress = ref(0)
const chunkSize = 5 * 1024 * 1024 // 5MB

const handleUpload = async (options: UploadRequestOption) => {
  const { file } = options
  const totalChunks = Math.ceil(file.size / chunkSize)
  let currentChunk = 0

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
          uploadProgress.value = Math.round((progressEvent.loaded / progressEvent.total) * 100)
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

const handleRemove = (file) => {
  fileList.value = fileList.value.filter((item) => item.uid !== file.uid)
}

const handleChange = (info) => {
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
