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
  console.log(value)
  app.setThemeName(value)
  color.value = value
}
</script>

<template>
  <div>
    <section>
      <h2>主题设置</h2>
      <form>
        <label>主要颜色</label>
        <input v-model="color" type="color" @change="handleChange(color)" />
      </form>
      <a-select v-model:value="app.themeName" style="width: 240px">
        <a-select-option v-for="(color, name) in variables" :key="name" :value="name">
          {{ name }}:{{ color }}
        </a-select-option>
      </a-select>
      <h1>预设主题</h1>
      <template v-for="(color, name) in variables" :key="name">
        <a-button :style="{ background: color }" @click="handleChange(color)">
          {{ name }}
        </a-button>
      </template>

      <a-select v-model:value="app.darkMode" style="width: 120px">
        <a-select-option value="dark">dark</a-select-option>
        <a-select-option value="light">light</a-select-option>
      </a-select>
      <a-button-group>
        <a-button type="primary">切换主题- {{ app.themeName }}</a-button>
        <a-button @click="app.toggleDarkMode">切换模式{{ app.darkModeComp }}</a-button>
      </a-button-group>
    </section>
  </div>
</template>

<style lang="scss" scoped></style>
@/stores/modules/app
