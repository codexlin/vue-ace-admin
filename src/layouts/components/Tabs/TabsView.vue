<script lang="ts" setup>
import { h } from 'vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import type { TabsProps } from 'ant-design-vue'
import useLocalI18n from '@/hooks/useLocalI18n'
import { refreshKey } from '@/layouts/type'
import { useTabsStore } from '@/stores/modules/tabs'

interface Props {
  title: string
  key: string
  closable?: boolean
  content?: string
}
type Key = string | number
const mode = ref<TabsProps['tabPosition']>('top')
const callback: TabsProps['onTabScroll'] = (val) => {
  console.log(val)
}
const { tt } = useLocalI18n()
const route = useRoute()
const tabStore = useTabsStore()
const { deleteTab, clickTab, refreshTab } = tabStore
const { activeKey, tabList } = storeToRefs(tabStore)
const curTab = ref<Props>()
const refresh = inject<() => Promise<void>>(refreshKey)
const onRefresh = (name: string) => refreshTab(name, refresh!)

const onEdit = (targetKey: KeyboardEvent | MouseEvent | Key, action: 'add' | 'remove') => {
  if (action !== 'add') deleteTab('cur', targetKey as string)
}
watch(
  route,
  (to) => {
    console.log(11)
    const { meta, name, fullPath } = to
    const closable = fullPath !== '/dashboard'
    const item = { title: meta.title, key: fullPath, closable, content: name } as Props
    const hasFind = tabList.value.find((i) => i.key === fullPath)
    activeKey.value = fullPath
    if (!hasFind) tabStore.addTab(item)
    curTab.value = tabList.value.filter((item) => item.key === activeKey.value)[0]
  },
  { immediate: true }
)
</script>
<template>
  <div class="tabs">
    <a-tabs
      v-model:activeKey="activeKey"
      :tab-position="mode"
      type="editable-card"
      hide-add
      @edit="onEdit"
      @tab-click="clickTab"
      @tab-scroll="callback"
    >
      <a-tab-pane v-for="i in tabList" :key="i.key" :closable="i.closable">
        <template #tab>
          <a-dropdown :trigger="['contextmenu']">
            <span class="tab-name">{{ tt(i.title) }}</span>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1" @click="onRefresh(i.content!)">刷新</a-menu-item>
                <a-menu-item key="2" @click="deleteTab('cur', i.key)">关闭当前</a-menu-item>
                <a-menu-item key="3" @click="deleteTab('other', i.key)">关闭其他</a-menu-item>
                <a-menu-item key="4" @click="deleteTab('all', i.key)">关闭所有</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-tab-pane>
      <template #rightExtra>
        <a-button :icon="h(ReloadOutlined)" @click="onRefresh(curTab?.content!)" />
      </template>
    </a-tabs>
  </div>
</template>
<style scoped lang="scss">
.tabs {
  position: sticky;
  top: 0;
  z-index: 10;
  height: 40px;
  backdrop-filter: blur(5px);

  .ant-tabs-nav {
    height: 40px;
    padding: 5px 6px 5px 5px;
    margin: 0;

    & .ant-tabs-nav-list .ant-tabs-tab,
    .ant-tabs-nav-add {
      border-radius: 8px;

      & button {
        margin: 0 -8px 0 0;
      }
    }
  }
}
</style>
