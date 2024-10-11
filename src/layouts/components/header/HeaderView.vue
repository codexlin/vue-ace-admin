<script lang="ts" setup>
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import BreadcrumbView from '@/layouts/components/header/components/Breadcrumb/BreadCrumb.vue'
import FullScreen from '@/layouts/components/header/components/FullScreen/FullScreen.vue'
import LangSelect from '@/layouts/components/header/components/LangSelect/LangSelect.vue'
import PersonTool from '@/layouts/components/header/components/PersonTool/PersonTool.vue'
import ThemeSwitch from '@/layouts/components/header/components/ThemeSwitch/ThemeSwitch.vue'
import { useAppStore } from '@/stores/modules/app'
import useConfig from '@/layouts/composables/useConfig'

const app = useAppStore()
const { headerConfig } = useConfig()
const config = computed(() => headerConfig.value)
</script>

<template>
  <a-layout-header class="custom-layout layout-header">
    <div class="header-view">
      <div class="header-view-left">
        <div v-if="config.mode === 'inline'" class="header-view-item">
          <menu-unfold-outlined v-if="app.collapsed" class="trigger" @click="app.toggleCollapsed" />
          <menu-fold-outlined v-else class="trigger" @click="app.toggleCollapsed" />
        </div>
        <div v-if="app.appConfig.showBreadCrumb && config.showBreadcrumb" class="header-view-item breadcrumb">
          <BreadcrumbView />
        </div>
        <template v-if="config.showLogo">
          <slot name="logo" />
        </template>
        <slot />
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
  </a-layout-header>
</template>

<style lang="scss" scoped>
@import '@/styles/theme';

.layout-header {
  padding: 0;
}

.header-view {
  display: flex;
  justify-content: space-between;

  &-left {
    display: flex;
    gap: 10px;
    align-items: center;
    padding-left: 10px;
    overflow: hidden;
    white-space: nowrap;
  }

  &-right {
    display: flex;
    gap: 15px;
    align-items: center;
    padding-right: 10px;
    overflow: hidden;
    white-space: nowrap;
  }

  &-item {
    display: flex;
    align-items: center;
    font-size: 17px;
    cursor: pointer;
  }

  .breadcrumb {
    @include respond-to(sm) {
      display: none;
    }
  }

  .trigger {
    font-size: 1.3em;
    line-height: 1.3em;
  }
}
</style>
