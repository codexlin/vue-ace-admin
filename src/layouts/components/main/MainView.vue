<script lang="ts" setup>
import { refreshKey, type MatchPattern } from '../../type'
import TabsView from '@/layouts/components/tabs/TabsView.vue'
import { useTabsStore } from '@/stores/modules/tabs'
import { useAppStore } from '@/stores/modules/app'
import { useRoute } from 'vue-router'

const app = useAppStore()
const store = useTabsStore()
const route = useRoute()

void (() => {
  store.setCacheTabs()
})()

const isAlive = ref(true)
const showTabs = computed(() => app.appConfig.showTabs)

// 简单的动画名称列表（不复杂）
const transitionNames = ['fade', 'fade-scale', 'fade-slide']

// 当前使用的过渡动画名称（完全随机）
const transitionName = ref(transitionNames[0])

// 随机选择一个动画
const getRandomTransition = (): string => {
  const randomIndex = Math.floor(Math.random() * transitionNames.length)
  return transitionNames[randomIndex]
}

// 监听路由变化，每次切换时随机选择动画
watch(
  () => route.path,
  () => {
    transitionName.value = getRandomTransition()
  },
  { immediate: true }
)

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
        <transition mode="out-in" :name="transitionName">
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

// 淡入淡出
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 淡入缩放
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

// 淡入滑动
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
