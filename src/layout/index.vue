<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-14 21:29:57
 * @Description: 
-->
<script lang="ts" setup>
import SettingVue from '@/layout/setting/index.vue'
import router from '@/router'
import { useMenuStoreWithOut } from '@/stores/modules/menu'
import { provide } from 'vue'
import { RouterView } from 'vue-router'
import HeaderView from './header/index.vue'
import SidebarView from './sidebar/index.vue'
import { layoutProviderKey } from './type' // 引入上面定义的类型

defineOptions({
  name: 'LayoutView'
})
const menus = useMenuStoreWithOut().getMenuList || []
const routes = router.getRoutes()
provide(layoutProviderKey, {
  currentRoute: router.currentRoute.value,
  routes,
  menus
})
</script>
<template>
  <a-layout style="height: 100vh; min-width: 375px">
    <SidebarView class="custom-layout" />
    <a-layout>
      <a-layout-header class="custom-layout" :style="{ padding: 0 }">
        <HeaderView />
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div :style="{ padding: '24px', minHeight: '360px' }">
          <router-view v-slot="{ Component }">
            <transition name="fade">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center"> Ant Design ©2018 Created by Ant UED </a-layout-footer>
    </a-layout>
    <SettingVue />
  </a-layout>
</template>
<style lang="scss" scoped>
@import '@/styles/theme.scss';

.site-layout-sub-header-background {
  background: #fff;
}

.site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout-sub-header-background {
  background: #141414;
}
.custom-layout {
  @include useTheme {
    background: getModeVar('bgColor') !important;
  }
}
</style>
