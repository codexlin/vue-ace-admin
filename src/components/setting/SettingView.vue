<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import variables from '../../styles/variables.module.scss'

const app = useAppStore()
const color = ref(app.themeName)

function handleChange(value: string) {
  app.setThemeName(value)
}

watch(
  () => app.themeName,
  (theme: string) => {
    color.value = variables[theme] || theme
  }
)
</script>

<template>
  <div>
    <section>
      <h2>主题设置</h2>
      <input v-model="color" type="color" @change="handleChange(color)" />
      <a-select v-model:value="app.themeName" style="width: 240px">
        <a-select-option v-for="(color, name) in variables" :key="name" :value="name">
          {{ name }}:{{ color }}
        </a-select-option>
      </a-select>
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