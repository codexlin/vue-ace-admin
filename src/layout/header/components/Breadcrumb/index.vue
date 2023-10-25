<!--
import { HomeOutlined, UserOutlined } from '@ant-design/icons-vue';
 * @Date: 2023-10-25 23:27:26
 * @Description: 
-->
<script lang="ts" setup>
import router from '@/router'
import { HomeOutlined, UserOutlined } from '@ant-design/icons-vue'
import { inject, ref, watch } from 'vue'
import type { LayoutProviderData } from '@/layout/type'
defineOptions({
  name: 'BreadcrumbView'
})
const { menus } = inject<LayoutProviderData>('layoutProvider')
console.log(flattenRoutes(menus))
function flattenRoutes(routes) {
  const flattenedRoutes = []

  function flatten(route) {
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
const list = ref([])
const initList = (path) => {
  const routes = flattenRoutes(menus)
  const paths = path.split('/').filter(Boolean)
  if (paths.length === 1) {
    return routes.filter((i) => i.path === path)
  } else if (paths.length > 1) {
    const array = []
    paths.forEach((p, index) => {
      console.log(p)

      index === 0 ? array.push(routes.find((i) => i.path === `/${p}`)) : array.push(routes.find((i) => i.path === path))
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
    console.log(list.value)
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
      <a-breadcrumb-item href="" v-for="item in list" :key="item.path">
        <user-outlined />
        <span>{{ item.name }}</span>
      </a-breadcrumb-item>
    </template>
  </a-breadcrumb>
</template>

<style lang="scss" scoped></style>
