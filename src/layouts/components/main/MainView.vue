<script lang="ts" setup>
import { refreshKey, type MatchPattern } from '../../type'
import TabsView from '@/layouts/components/tabs/TabsView.vue'
import { useTabsStore } from '@/stores/modules/tabs'
import { useAppStore } from '@/stores/modules/app'
const app = useAppStore()
const store = useTabsStore()
void (() => {
  store.setCacheTabs()
})()
const isAlive = ref(true)
const showTabs = computed(() => app.appConfig.showTabs)

provide(refreshKey, async () => {
  isAlive.value = false
  await nextTick()
  isAlive.value = true
})
</script>
<template>
  <div>
    <TabsView v-show="showTabs" />
    <div class="main-wrapper">
      <router-view v-slot="{ Component, route }">
        <transition mode="out-in" name="scale">
          <keep-alive :include="store.getCacheTabs as MatchPattern">
            <component :is="Component" v-if="isAlive" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.main-wrapper {
  min-height: 360px;
  padding: 20px;
}
</style>
