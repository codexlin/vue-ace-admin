<script lang="ts" setup>
import { gsap } from 'gsap'
import { useAppStore } from '@/stores/modules/app'

onMounted(() => {
  gsap.to('.logo-img', { rotation: 360, duration: 2, ease: 'bounce.out', repeat: Infinity })
})
const app = useAppStore()
const width = computed(() => (app.collapsed ? '80px' : '200px'))
</script>

<template>
  <div class="logo">
    <img alt="logo" class="logo-img" height="32" src="assets/images/logo.svg" width="32" />
    <span v-if="!app.collapsed">Vue Ace Admin</span>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/theme';

.logo {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: v-bind(width);
  height: var(--header-height);

  span {
    font-size: 16px;
    font-weight: bold;
    color: getColor('primary');
    transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
  }
}
</style>
