<script lang="ts" setup>
import RecursiveMenu from '@/components/sidermenu/RecursiveMenu.vue'
import { defineProps } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

defineProps({
  menus: {
    type: Array as () => RouteRecordRaw[],
    required: true
  }
})
</script>
<template>
  <a-menu class="custom-layout" mode="inline">
    <template v-for="menu in menus">
      <a-menu-item v-if="!menu.children || menu.children.length === 0" :key="menu.path">
        <router-link :to="menu.path">
          <span>{{ menu.name }}</span>
        </router-link>
      </a-menu-item>
      <a-sub-menu v-else :key="menu.name">
        <template #title>
          <span>{{ menu.name }}</span>
        </template>
        <a-menu-item v-for="child in menu.children" :key="child.name">
          <router-link :to="child.path">
            <recursive-menu :menus="[child]" />
          </router-link>
        </a-menu-item>
      </a-sub-menu>
    </template>
  </a-menu>
</template>

<style lang="scss">
@import '@/styles/theme.scss';

.custom-layout {
  @include useTheme {
    background: getModeVar('bgColor') !important;
  }
}
</style>
