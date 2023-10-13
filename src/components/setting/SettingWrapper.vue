<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-09 21:24:22
 * @Description: 
-->
<template>
  <a-button
    @click="showDrawer"
    class="setting-fixed"
    type="primary"
    shape="circle"
    :icon="h(SettingOutlined)"
  />
  <a-drawer
    v-model:open="open"
    class="custom-class"
    root-class-name="root-class-name"
    :root-style="{ color: 'blue' }"
    style="color: red"
    title="Basic Drawer"
    placement="right"
    @after-open-change="afterOpenChange"
  >
    <SettingView />
  </a-drawer>
</template>
<script lang="ts" setup>
import SettingView from '@/components/setting/SettingView.vue'
import { SettingOutlined } from '@ant-design/icons-vue'
import { h, ref } from 'vue'
const open = ref<boolean>(false)

const afterOpenChange = (bool: boolean) => {
  console.log('open', bool)
}

const showDrawer = () => {
  open.value = true
}
</script>
<style lang="scss" scoped>
.setting-fixed {
  position: fixed;
  z-index: 2;
  right: 0;
  top: 50%;
}
</style>
