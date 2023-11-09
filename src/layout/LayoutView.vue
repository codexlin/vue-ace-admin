<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-14 21:29:57
 * @Description: 
-->
<script lang="ts" setup>
import SettingVue from '@/layout/setting/SettingView.vue'
import { RouterView } from 'vue-router'
import FooterView from './footer/FooterView.vue'
import HeaderView from './header/HeaderView.vue'
import SidebarView from './sidebar/SidebarView.vue'
</script>
<template>
  <a-layout style="height: 100vh; min-width: 375px">
    <SidebarView />
    <a-layout>
      <HeaderView> </HeaderView>
      <a-layout-content class="layout-content">
        <div :style="{ padding: '24px', minHeight: '360px' }">
          <router-view v-slot="{ Component, route }">
            <transition name="fade">
              <KeepAlive>
                <component :is="Component" :key="route.name" />
              </KeepAlive>
            </transition>
          </router-view>
        </div>
      </a-layout-content>
      <FooterView />
    </a-layout>
    <SettingVue />
  </a-layout>
</template>
<style lang="scss" scoped>
@import '@/styles/theme.scss';

//.site-layout-sub-header-background {
//  background: #fff;
//}
//
//.site-layout-background {
//  background: #fff;
//}
//
//[data-theme='dark'] .site-layout-sub-header-background {
//  background: #141414;
//}
.trigger {
  font-size: 2em;
  line-height: 2em;
}

.layout-content {
  overflow-y: auto;
  margin: 44px 16px 0;
  /* ---滚动条公共样式--- */

  /*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
  // 滚动条整体部分
  &::-webkit-scrollbar {
    width: 6px;
    height: 8px;
  }

  // 滚动条的轨道的两端按钮，允许通过点击微调小方块的位置。
  &::-webkit-scrollbar-button {
    display: none;
  }

  // 滚动条里面的小方块，能向上向下移动（或往左往右移动，取决于是垂直滚动条还是水平滚动条）
  &::-webkit-scrollbar-thumb {
    @include useTheme {
      background: getColor('primary');
    }
    //background: rgba(144, 147, 153, 0.3);
    cursor: pointer;
    border-radius: 4px;
  }

  // 边角，即两个滚动条的交汇处
  &::-webkit-scrollbar-corner {
    display: none;
  }

  // 两个滚动条的交汇处上用于通过拖动调整元素大小的小控件
  &::-webkit-resizer {
    display: none;
  }
}
</style>
