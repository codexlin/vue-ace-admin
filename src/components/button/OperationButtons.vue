<script setup lang="ts">
import { EllipsisOutlined } from '@ant-design/icons-vue'
import type { Item } from '@/components/button/type'

const props = defineProps<{
  items: Item[]
}>()
const menuArray = computed<Item[]>(() => (props.items.length > 2 ? props.items.slice(1) : props.items))
</script>
<template>
  <div v-if="items.length > 3">
    <a-space>
      <template #split>
        <a-divider type="vertical" />
      </template>
      <a @click="() => items[0].cb()"> {{ items[0].text }}</a>
      <a-dropdown placement="bottom">
        <EllipsisOutlined />
        <template #overlay>
          <a-menu>
            <template v-for="item in menuArray" :key="item.btnName">
              <a-menu-item>
                <a @click="item.cb()">{{ item.text }}</a>
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
        <a @click="() => item.cb()"> {{ item.text }}</a>
      </template>
    </a-space>
  </div>
</template>

<style scoped lang="scss"></style>
