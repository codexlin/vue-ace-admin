<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-14 21:29:57
 * @Description: 
-->
<script lang="ts" setup>
import { useAppStore } from '@/stores/modules/app'
import variables from '@/styles/variables.module.scss'
import { ref } from 'vue'

const app = useAppStore()
const color = ref(app.themeName)
function handleChange(value: string) {
  app.setThemeName(value)
  color.value = value
}
</script>

<template>
  <div class="setting-drawer">
    <div>
      <h3>自定义主题颜色</h3>
      <input v-model="color" type="color" @change="handleChange(color)" />
      <a-select v-model:value="app.themeName" style="width: 240px">
        <a-select-option v-for="(color, name) in variables" :key="name" :value="name">
          {{ name }}:{{ color }}
        </a-select-option>
      </a-select>
    </div>
    <div>
      <h3>预设主题颜色</h3>
      <a-space wrap>
        <template v-for="(color, name) in variables" :key="name">
          <a-button :style="{ background: color }" @click="handleChange(color)">
            {{ name }}
          </a-button>
        </template>
      </a-space>
    </div>
    <div>
      <h3>布局设置</h3>
      <a-select v-model:value="app.darkMode" style="width: 120px">
        <a-select-option value="dark">dark</a-select-option>
        <a-select-option value="light">light</a-select-option>
      </a-select>
    </div>
    <div>
      <h3>其他设置</h3>
      <a-button-group>
        <a-button @click="app.toggleDarkMode">切换模式{{ app.darkModeComp }}</a-button>
      </a-button-group>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setting-drawer {
  display: flex;
  flex-direction: column;
  div {
    margin-bottom: 20px;
  }
}
</style>
