<script lang="ts" setup>
import RecursiveMenu from '@/layouts/components/sidebar/components/RecursiveMenu.vue'
import globalConfig from '@/config/system/appConfig'
import FooterView from '@/layouts/components/footer/FooterView.vue'
import MainView from '@/layouts/components/main/index.vue'
import HeaderView from '@/layouts/components/header/HeaderView.vue'
import SettingVue from '@/layouts/components/setting/SettingView.vue'
import { useAppStore } from '@/stores/modules/app'
import LogoView from '@/layouts/components/logo/index.vue'

defineOptions({
  name: 'HorizonLayout'
})

const app = useAppStore()
const content = app.getWaterMarkContent
</script>
<template>
  <a-watermark v-bind="{ ...globalConfig.watermark, content }">
    <a-layout style="height: 100vh; min-width: 375px">
      <a-layout>
        <HeaderView>
          <template #logo>
            <LogoView />
          </template>
          <recursive-menu />
        </HeaderView>
        <a-layout-content class="layout-content">
          <MainView />
        </a-layout-content>
        <FooterView />
      </a-layout>
      <SettingVue />
    </a-layout>
  </a-watermark>
</template>
