<script lang="ts" setup>
import { refreshKey, type MatchPattern } from '../../type'
import TabsView from '@/layouts/components/Tabs/TabsView.vue'
import { useTabsStore } from '@/stores/modules/tabs'

const store = useTabsStore()
void (() => {
  store.setCacheTabs()
})()
const isAlive = ref(true)
provide(refreshKey, async () => {
  isAlive.value = false
  await nextTick()
  isAlive.value = true
})
</script>
<template>
  <div>
    <TabsView />
    <div :style="{ padding: '20px', minHeight: '360px' }">
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
