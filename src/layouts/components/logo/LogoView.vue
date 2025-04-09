<script lang="ts" setup>
import { gsap } from 'gsap'
import { useAppStore } from '@/stores/modules/app'

onMounted(() => {
  gsap.to('.logo__img', {
    scale: 1.2,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })
})
const app = useAppStore()
const width = computed(() => (app.collapsed ? '80px' : '200px'))
</script>

<template>
  <div class="logo">
    <img alt="logo" class="logo__img" height="32" src="assets/images/logo.svg" width="32" />
    <span v-if="!app.collapsed">Vue Ace Admin</span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/theme';

.logo {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: v-bind(width);
  height: var(--header-height);

  span {
    font-size: 16px;
    font-weight: bold;
    color: theme.get-color('primary'); /* 也可用v-bind token */
    transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
  }
}
</style>
