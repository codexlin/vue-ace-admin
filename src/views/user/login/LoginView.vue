<template>
  <div class="test">login</div>
  <div>
    <CustomButton :icon="h(SearchOutlined)" auto-loading @click="handleClick">自定义按钮</CustomButton>
    <CustomButton auto-loading enable-confirm @click="handleClick">
      自定义按钮2
      <template #icon>
        <SearchOutlined />
      </template>
    </CustomButton>
  </div>
</template>

<script lang="ts" setup>
import CustomButton from '@/components/button/index.vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

const handleClick = () => {
  return new Promise((resolve, reject) => {
    console.log('11')
    setTimeout(() => {
      resolve(console.log('click'))
    }, 2000)
  })
}
const handleClick1 = () => {
  console.log('click')
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme';

.test {
  height: 20px;
  @include useTheme {
    // 定制
    background-color: getColor(primary);
  }
}
</style>
