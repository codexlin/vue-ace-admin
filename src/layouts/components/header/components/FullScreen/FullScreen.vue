<script lang="ts" setup>
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, toggle } = useFullscreen()
</script>

<template>
  <a-tooltip placement="bottom">
    <template #title>
      {{ isFullscreen ? '退出全屏' : '开启全屏' }}
    </template>
    <div @click="toggle">
      <fullscreen-outlined v-show="!isFullscreen" />
      <fullscreen-exit-outlined v-show="isFullscreen" />
    </div>
  </a-tooltip>
</template>

<style lang="scss" scoped></style>
