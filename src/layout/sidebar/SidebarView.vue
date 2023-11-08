<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description: 
-->
<script lang="ts" setup>
import RecursiveMenuVue from './components/RecursiveMenu.vue'
import { useAppStore } from '@/stores/modules/app'
import { computed } from 'vue'

const app = useAppStore()
const width = computed(() => (app.collapsed ? '80px' : '200px'))
</script>
<template>
  <div class="logo">
    <img alt="logo" height="32" src="../../assets/logo.svg" width="32" />
    <span v-if="!app.collapsed">Vue Ace Admin</span>
  </div>
  <RecursiveMenuVue />
</template>
<style lang="scss" scoped>
.logo {
  height: 32px;
  margin: 16px 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: v-bind(width);

  span {
    transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
    font-weight: bold;
  }
}

.fixed-side {
  position: absolute;
  z-index: 999;
}
</style>
