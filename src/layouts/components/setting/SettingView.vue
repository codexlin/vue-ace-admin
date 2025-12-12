<script lang="ts" setup>
import { SettingOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

import DrawerForm from '@/layouts/components/setting/components/DrawerForm.vue'

const open = ref<boolean>(false)

const afterOpenChange = (bool: boolean) => {
  console.log('open', bool)
}

const showDrawer = () => {
  open.value = true
}
</script>
<template>
  <a-button
    :icon="h(SettingOutlined, { spin: true })"
    class="setting-fixed"
    shape="circle"
    type="primary"
    @click="showDrawer"
  />
  <a-drawer
    v-model:open="open"
    class="custom-class"
    placement="right"
    root-class-name="root-class-name"
    title="全局配置"
    @after-open-change="afterOpenChange"
  >
    <DrawerForm />
  </a-drawer>
</template>

<style lang="scss" scoped>
.setting-fixed {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: 2;
}
</style>
