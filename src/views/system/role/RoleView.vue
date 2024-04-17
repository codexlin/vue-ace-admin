<script setup lang="ts">
import { getRoleList } from '../api'

onMounted(async () => {
  const res = await getRoleList()
  console.log('Role View mounted', res)
})
</script>
<template>
  <div>
    <h1>Role View</h1>
    <CommonTable />
  </div>
</template>
<style scoped></style>
