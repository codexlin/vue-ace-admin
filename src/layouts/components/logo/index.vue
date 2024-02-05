<script lang="ts" setup>
import { useAppStore } from '@/stores/modules/app'
import { gsap } from 'gsap'

defineOptions({
  name: 'LogoView'
})
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
  height: var(--header-height);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: v-bind(width);

  span {
    transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
    font-weight: bold;
    font-size: 16px;
    color: getColor('primary');
  }
}
</style>
