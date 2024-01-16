<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-14 21:29:57
 * @Description:
-->
<script lang="ts" setup>
import SettingVue from '@/layout/setting/SettingView.vue'
import { useAppStore } from '@/stores/modules/app'
import { useTabsStore } from '@/stores/modules/tabs'
import FooterView from './footer/FooterView.vue'
import HeaderView from './header/HeaderView.vue'
import SidebarView from './sidebar/SidebarView.vue'
import { refreshKey, type MatchPattern } from './type'
const app = useAppStore()
const store = useTabsStore()
;(() => {
  store.setCacheTabs()
})()
const isAlive = ref(true)
provide(refreshKey, async () => {
  isAlive.value = false
  await nextTick()
  isAlive.value = true
})
const fontSize = computed(() => (app.appConfig.watermark.isShow ? app.appConfig.watermark.font.fontSize : 0))
</script>
<template>
  <a-watermark v-bind="app.appConfig.watermark" :font="{ fontSize }">
    <a-layout style="height: 100vh; min-width: 375px">
      <SidebarView />
      <a-layout>
        <HeaderView />
        <a-layout-content class="layout-content">
          <div :style="{ padding: '24px', minHeight: '360px' }">
            <router-view v-slot="{ Component, route }">
              <transition name="scale" mode="out-in">
                <keep-alive :include="store.getCacheTabs as MatchPattern">
                  <component :is="Component" v-if="isAlive" :key="route.path" />
                </keep-alive>
              </transition>
            </router-view>
          </div>
        </a-layout-content>
        <FooterView />
      </a-layout>
      <SettingVue />
    </a-layout>
  </a-watermark>
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
  // margin: 41px 0 0;
  /* ---滚动条公共样式--- */

  /*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
  // 滚动条整体部分
  &::-webkit-scrollbar {
    width: 6px;
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    width: 6px;
    height: 6px;
    // background: rgb(239, 239, 239);
    border-radius: 2px;
  }
  // 滚动条的轨道的两端按钮，允许通过点击微调小方块的位置。
  &::-webkit-scrollbar-button {
    display: none;
  }

  // 滚动条里面的小方块，能向上向下移动（或往左往右移动，取决于是垂直滚动条还是水平滚动条）
  &::-webkit-scrollbar-thumb {
    // @include useTheme {
    //   background: getColor('primary');
    // }
    background-color: rgba(144, 147, 153, 0.3);
    cursor: pointer;
    border-radius: 4px;
    transition: 0.3s background-color;
    &:hover {
      background-color: rgba(144, 147, 153, 0.5);
    }
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
