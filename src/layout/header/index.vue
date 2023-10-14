<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-14 21:29:57
 * @Description: 
-->
<script lang="ts" setup>
import FullScreen from './FullScreen/index.vue'
import LangSelect from './LangSelect/index.vue'
import PersonTool from './PersonTool/index.vue'
import ThemeSwitch from './ThemeSwitch/index.vue'

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
      <ThemeSwitch />
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
  gap: 15px;
  .header-tool-item {
    cursor: pointer;
  }
}
</style>
