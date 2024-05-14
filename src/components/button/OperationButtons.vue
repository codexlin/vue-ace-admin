<script lang="ts" setup>
import type { Item } from '@/components/button/type'
import useLocalI18n from '@/hooks/useLocalI18n'
import { DownOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  items: Item[]
}>()
const menuArray = computed<Item[]>(() => (props.items.length > 2 ? props.items.slice(1) : props.items))
const { tt } = useLocalI18n()
</script>
<template>
  <div v-if="items.length > 3">
    <a-space>
      <template #split>
        <a-divider type="vertical" />
      </template>
      <a v-permission="[items[0].auth]" @click="() => items[0].cb()"> {{ items[0].text }}</a>
      <a-dropdown placement="bottom">
        <a class="ant-dropdown-link" @click.prevent>
          {{ tt('common.more') }}
          <DownOutlined />
        </a>
        <template #overlay>
          <a-menu>
            <template v-for="item in menuArray" :key="item.btnName">
              <a-menu-item>
                <a v-permission="[item.auth]" @click="item.cb()">{{ item.text }}</a>
              </a-menu-item>
            </template>
          </a-menu>
        </template>
      </a-dropdown>
    </a-space>
  </div>
  <div v-else>
    <a-space>
      <template #split>
        <a-divider type="vertical" />
      </template>
      <template v-for="item in items" :key="item.btn">
        <a v-permission="[item.auth]" @click="() => item.cb()"> {{ item.text }}</a>
      </template>
    </a-space>
  </div>
</template>
