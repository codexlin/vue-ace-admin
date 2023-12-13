<script lang="ts" setup>
import useLocalI18n from '@/hooks/useLocalI18n'
import router from '@/router'
import { useRouteStore } from '@/stores/modules/route'
import { flattenRoutes, getLevelPaths } from '@/utils/common/routeUtil'
import { HomeOutlined } from '@ant-design/icons-vue'
import { gsap } from 'gsap'
import type { Route, Routes } from 'types/common'
onMounted(() => {
  gsap.fromTo(
    '.breadcrumb-title',
    { opacity: 0, visibility: 'hidden' }, // 初始设置为透明，上移50像素，隐藏
    {
      opacity: 1,
      y: 0,
      visibility: 'visible', // 设置为可见
      duration: 0.5,
      ease: 'power3.inOut'
    }
  )
})
const { tt } = useLocalI18n()
const menus = useRouteStore().getRoutes || []
const breadcrumbs = ref<Routes>([])
const initBreadcrumb = (path: string) => {
  const routes = flattenRoutes(menus)
  const paths = getLevelPaths(path)

  if (paths.length === 1) {
    return routes.filter((i) => i.path === path)
  } else if (paths.length > 1) {
    paths[paths.length - 1] = path
    const array: Routes = []
    paths.forEach((p) => {
      const output = routes.find((i) => i.path === p) as Route
      array.push(output)
    })
    return array
  } else {
    return []
  }
}
watch(
  () => router.currentRoute.value.path,
  (path) => {
    breadcrumbs.value = initBreadcrumb(path)
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <a-breadcrumb>
    <a-breadcrumb-item href="">
      <home-outlined />
    </a-breadcrumb-item>
    <template v-if="breadcrumbs.length > 0">
      <a-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" href="">
        <span class="breadcrumb-title">{{ tt(`${item.meta?.title}`) }}</span>
      </a-breadcrumb-item>
    </template>
  </a-breadcrumb>
</template>
