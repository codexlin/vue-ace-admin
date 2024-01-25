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
import { useAppStore } from '@/stores/modules/app'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'

const app = useAppStore()
</script>

<template>
  <a-layout-header class="custom-layout layout-header">
    <div class="header-view">
      <div class="header-view-left">
        <div class="header-view-item" style="display: flex">
          <menu-unfold-outlined v-if="app.collapsed" class="trigger" @click="app.toggleCollapsed" />
          <menu-fold-outlined v-else class="trigger" @click="app.toggleCollapsed" />
        </div>
        <div class="header-view-item breadcrumb">
          <BreadcrumbView />
        </div>
      </div>
      <div class="header-view-right">
        <!-- 全屏 -->
        <div class="header-view-item">
          <FullScreen />
        </div>
        <div class="header-view-item">
          <LangSelect />
        </div>
        <div class="header-view-item">
          <ThemeSwitch />
        </div>
        <div class="header-view-item">
          <PersonTool />
        </div>
      </div>
    </div>
    <div>
      <TabsView></TabsView>
    </div>
  </a-layout-header>
</template>

<style lang="scss" scoped>
.trigger {
  font-size: 1.3em;
  line-height: 1.3em;
}
.layout-header {
  margin-bottom: 40px;
  padding: 0;
}
.header-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-left {
    gap: 10px;
    padding-left: 10px;
    display: flex;
    align-items: center;
  }

  &-right {
    padding-right: 10px;
    gap: 15px;
    display: flex;
    align-items: center;
  }

  &-item {
    // :deep(.anticon) {
    //   font-size: 18px;
    // }
    cursor: pointer;
  }
}
</style>
