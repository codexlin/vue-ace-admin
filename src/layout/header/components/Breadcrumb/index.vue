<!--
import { HomeOutlined, UserOutlined } from '@ant-design/icons-vue';
 * @Date: 2023-10-25 23:27:26
 * @Description: 
-->
<script lang="ts" setup>
import useLocalI18n from '@/hooks/useLocalI18n'
import { layoutProviderKey, type LayoutProviderData } from '@/layout/type'
import router from '@/router'
import { getLevelPaths } from '@/utils/common/routeUtil'
import { HomeOutlined } from '@ant-design/icons-vue'
import { inject, ref, watch } from 'vue'
import { useRoute, type RouteRecordRaw } from 'vue-router'

defineOptions({
  name: 'BreadcrumbView'
})
const { menus } = inject(layoutProviderKey) as LayoutProviderData
const { tt } = useLocalI18n()
const route = useRoute()
console.log(route)
function flattenRoutes(routes: RouteRecordRaw[]) {
  const flattenedRoutes: RouteRecordRaw[] = []

  function flatten(route: RouteRecordRaw[]) {
    route.forEach((r) => {
      const flattenedRoute = { ...r }
      flattenedRoutes.push(flattenedRoute)

      if (r.children) {
        flatten(r.children)
      }
    })
  }
  flatten(routes)
  return flattenedRoutes
}
const list = ref<RouteRecordRaw[]>([])
const initList = (path: string) => {
  const routes = flattenRoutes(menus)
  const paths = getLevelPaths(path)

  if (paths.length === 1) {
    return routes.filter((i) => i.path === path)
  } else if (paths.length > 1) {
    paths[paths.length - 1] = path
    const array: RouteRecordRaw[] = []
    paths.forEach((p) => {
      const output = routes.find((i) => i.path === p) as RouteRecordRaw
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
    list.value = initList(path)
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <a-breadcrumb>
    <a-breadcrumb-item href="">
      <home-outlined />
    </a-breadcrumb-item>
    <template v-if="list.length > 0">
      <a-breadcrumb-item v-for="item in list" :key="item.path" href="">
        <span>{{ tt(`${item.meta?.title}`) }}</span>
      </a-breadcrumb-item>
    </template>
  </a-breadcrumb>
</template>
