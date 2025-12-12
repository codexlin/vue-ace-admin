<script lang="ts" setup>
import { motion } from 'motion-v'

import { useAppStore } from '@/stores/modules/app'
import logoImg from '@/assets/images/logo.svg'

const app = useAppStore()
const width = computed(() => (app.collapsed ? '80px' : '200px'))
const MotionImg = motion.img
const logoAnimation = {
  initial: { scale: 1 },
  animate: { scale: 1.12 },
  transition: { duration: 1.2, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut' as const }
}
</script>

<template>
  <div class="logo">
    <MotionImg
      alt="logo"
      class="logo__img"
      height="32"
      :src="logoImg"
      width="32"
      :initial="logoAnimation.initial"
      :animate="logoAnimation.animate"
      :transition="logoAnimation.transition"
    />
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
