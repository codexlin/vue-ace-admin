<template>
  <div>
    <a-radio-group v-model:value="mode" :style="{ marginBottom: '8px' }">
      <a-radio-button value="top">Horizontal</a-radio-button>
      <a-radio-button value="left">Vertical</a-radio-button>
    </a-radio-group>
    <a-tabs
      v-model:activeKey="activeKey"
      :style="{ height: '200px' }"
      :tab-position="mode"
      type="editable-card"
      @tabScroll="callback"
    >
      <a-tab-pane v-for="i in 30" :key="i" :tab="`Tab-${i}`" closable>Content of tab {{ i }}</a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import type { TabsProps } from 'ant-design-vue'
import { ref } from 'vue'

defineOptions({
  name: 'TabsView'
})
const mode = ref<TabsProps['tabPosition']>('top')
const activeKey = ref(1)
const callback: TabsProps['onTabScroll'] = (val) => {
  console.log(val)
}
</script>
