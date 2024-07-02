<script lang="ts" setup>
import { SearchOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
import CustomButton from '@/components/button/CustomButton.vue'
import SvgIconVue from '@/components/svgIcon/SvgIcon.vue'

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
  <div>
    <div class="test">retail</div>
    <div>
      <a-input v-model:value="value" />
      <CustomButton :icon="h(SearchOutlined)" auto-loading @click="handleClick">自定义按钮</CustomButton>
      <CustomButton :icon="h(SvgIconVue, { name: 'mdi:account-cog-outline' })" auto-loading @click="handleClick"
        >自定义按钮1
      </CustomButton>

      <CustomButton auto-loading enable-confirm @click="handleClick">
        自定义按钮2
        <template #icon>
          <SvgIconVue name="mdi:account-cog-outline" />
        </template>
      </CustomButton>
    </div>
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
