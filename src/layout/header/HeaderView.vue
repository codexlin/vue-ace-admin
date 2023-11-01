<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-14 21:29:57
 * @Description: 
-->
<script lang="ts" setup>
import BreadcrumbView from '@/layout/header/components/Breadcrumb/BreadCrumb.vue'
import FullScreen from '@/layout/header/components/FullScreen/FullScreen.vue'
import LangSelect from '@/layout/header/components/LangSelect/LangSelect.vue'
import PersonTool from '@/layout/header/components/PersonTool/PersonTool.vue'
import TabsView from '@/layout/header/components/Tabs/TabsView.vue'
import ThemeSwitch from '@/layout/header/components/ThemeSwitch/ThemeSwitch.vue'
</script>

<template>
  <div class="header-view">
    <div class="left-tools">
      <div class="header-tool-item">
        <BreadcrumbView />
      </div>
    </div>
    <div class="right-tools">
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
  </div>
  <div>
    <TabsView></TabsView>
  </div>
</template>

<style lang="scss" scoped>
.header-view {
  display: flex;
  justify-content: space-between;

  .left-tools {
    padding-left: 10px;
    display: flex;
    align-items: center;
  }
  .right-tools {
    padding-right: 10px;
    gap: 15px;
    display: flex;
  }
}
.header-tool-item {
  cursor: pointer;
}
</style>
