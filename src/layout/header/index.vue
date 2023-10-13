<script lang="ts" setup>
import FullScreen from './FullScreen/index.vue'
import LangSelect from './LangSelect/index.vue'
import PersonTool from './PersonTool/index.vue'

defineOptions({
  name: 'HeaderView'
})
</script>

<template>
  <div class="header-view">
    <!-- 全屏 -->
    <div class="header-tool-item">
      <FullScreen />
    </div>
    <div class="header-tool-item">
      <LangSelect />
    </div>
    <div class="header-tool-item">
      <PersonTool />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-view {
  float: right;
  display: flex;
  gap: 10px;
}
</style>