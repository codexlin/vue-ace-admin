<script lang="ts" setup>
import useLocalI18n from '@/hooks/useLocalI18n'
import { useTabsStore } from '@/stores/modules/tabs'
import type { TabsProps } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Props {
  title: string
  key: string
  closable?: boolean
  content?: string
}

const mode = ref<TabsProps['tabPosition']>('top')
const callback: TabsProps['onTabScroll'] = (val) => {
  console.log(val)
}
const { tt } = useLocalI18n()

const route = useRoute()
const router = useRouter()

const tabStore = useTabsStore()
const { activeKey, tabList } = storeToRefs(tabStore)
const clickTab = (key: string) => router.push(key)

const onEdit = (targetKey: string | MouseEvent, action: string) => {
  if (action !== 'add') tabStore.deleteTab(targetKey as string)
}
watch(
  route,
  (to, from) => {
    const { meta, name, fullPath } = to
    const closable = fullPath !== '/dashboard'
    const item = { title: meta.title, key: fullPath, closable, content: name } as Props
    const hasFind = tabList.value.find((i) => i.key === fullPath)
    activeKey.value = fullPath
    if (!hasFind) tabStore.addTab(item)
  },
  { immediate: true }
)
</script>
<template>
  <div>
    <a-tabs
      v-model:activeKey="activeKey"
      :tab-position="mode"
      type="editable-card"
      @edit="onEdit"
      @tabClick="clickTab"
      @tabScroll="callback"
    >
      <a-tab-pane v-for="i in tabList" :key="i.key" :closable="i.closable" :tab="tt(i.title)"></a-tab-pane>
    </a-tabs>
  </div>
</template>
