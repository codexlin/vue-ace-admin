<script lang="ts" setup>
import SettingVue from '@/components/setting/index.vue'
import { RouterView } from 'vue-router'
import SidebarView from './sidebar/index.vue'
import HeaderView from './header/index.vue'

defineOptions({
  name: 'LayoutView'
})
</script>
<template>
  <a-layout style="height: 100vh; min-width: 375px">
    <SidebarView />
    <a-layout>
      <a-layout-header :style="{ padding: 0 }">
        <HeaderView />
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div :style="{ padding: '24px', minHeight: '360px' }">
          <RouterView />
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
    <SettingVue />
  </a-layout>
</template>
<style lang="scss" scoped>
.site-layout-sub-header-background {
  background: #fff;
}

.site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout-sub-header-background {
  background: #141414;
}
</style>
