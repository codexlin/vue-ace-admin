<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-09 21:24:22
 * @Description: 
-->
<template>
  <a-layout style="height: 100vh">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div class="logo">logo</div>
      <a-menu v-model:selectedKeys="selectedKeys" :theme="app.darkMode" mode="inline">
        <a-menu-item key="1">
          <RouterLink to="/dashboard">
            <user-outlined />
            <span class="nav-text">首页</span>
          </RouterLink>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ padding: 0 }" />
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div :style="{ padding: '24px', minHeight: '360px' }">
          <RouterView />
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
    <Setting />
  </a-layout>
</template>
<script lang="ts" setup>
import Setting from '@/components/setting/SettingWrapper.vue'
import { useAppStore } from '@/stores/app'
import { UserOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { RouterView } from 'vue-router'
const app = useAppStore()
const onCollapse = (collapsed: boolean, type: string) => {
  console.log(collapsed, type)
}

const onBreakpoint = (broken: boolean) => {
  console.log(broken)
}
const selectedKeys = ref<string[]>(['1'])
</script>
<style scoped lang="scss">
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

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
