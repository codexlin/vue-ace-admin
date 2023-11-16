<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-14 21:29:57
 * @Description: 
-->
<script lang="ts" setup>
import { useAppStore } from '@/stores/modules/app'
import variables from '@/styles/variables.module.scss'
import systemConfig from '@/config/system'

const app = useAppStore()
const color = ref(app.appConfig.token.colorPrimary)

function handleChange(value: string) {
  app.setThemeName(value)
  color.value = value
}

const reset = () => {
  app.resetDefault()
}
</script>

<template>
  <div class="setting-drawer">
    <a-button @click="reset">重置全部</a-button>

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
      <a-form>
        <a-form-item label="文字大小">
          <a-input-number v-model:value="app.appConfig.token.fontSize"></a-input-number>
        </a-form-item>
        <a-form-item label="圆角设置">
          <a-input-number v-model:value="app.appConfig.token.borderRadius"></a-input-number>
        </a-form-item>
        <a-form-item label="线框风格">
          <a-switch v-model:checked="app.appConfig.token.wireframe" checked-children="开" un-checked-children="关" />
        </a-form-item>
        <a-form-item label="紧凑模式">
          <a-switch v-model:checked="app.appConfig.compactAlgorithm" checked-children="开" un-checked-children="关" />
        </a-form-item>
      </a-form>
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
