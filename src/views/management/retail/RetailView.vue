<script lang="ts" setup>
import CustomButton from '@/components/button/CustomButton.vue'
import SvgIconVue from '@/components/svgicon/SvgIcon.vue'
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
const value = ref('')
</script>
<template>
  <div class="test">retail</div>
  <div>
    <a-input v-model:value="value"></a-input>
    <CustomButton :icon="h(SearchOutlined)" auto-loading @click="handleClick">自定义按钮</CustomButton>
    <CustomButton :icon="h(SvgIconVue, { name: 'mdi:account-cog-outline' })" auto-loading @click="handleClick"
      >自定义按钮1</CustomButton
    >

    <CustomButton auto-loading enable-confirm @click="handleClick">
      自定义按钮2
      <template #icon>
        <SvgIconVue name="mdi:account-cog-outline"></SvgIconVue>
      </template>
    </CustomButton>
  </div>
</template>

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
