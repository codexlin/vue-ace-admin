<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-14 21:29:57
 * @Description:
-->
<script lang="ts" setup>
import useLocalI18n from '@/hooks/useLocalI18n'
import { useAppStore } from '@/stores/modules/app'
import variables from '@/styles/variables.module.scss'

const app = useAppStore()
const color = ref(app.appConfig.token.colorPrimary)
Reflect.deleteProperty(variables, 'primary')
Reflect.deleteProperty(variables, 'info')

function handleChange(value: string) {
  app.setThemeName(value)
  color.value = value
}

const { tt } = useLocalI18n()
const reset = () => {
  app.resetDefault()
  color.value = app.appConfig.token.colorPrimary
}
</script>

<template>
  <div class="setting-drawer">
    <a-button type="primary" @click="reset">重置全部</a-button>
    <div>
      <p class="setting-title" data-label="自定义主题颜色" />
      <input v-model="color" class="color-picker" type="color" @change="handleChange(color)" />
    </div>
    <div>
      <p class="setting-title" data-label="预设主题颜色" />
      <a-space wrap>
        <template v-for="(color, name) in variables" :key="name">
          <a-button :style="{ background: color }" @click="handleChange(color)">
            {{ tt(`colors.${name}`) }}
          </a-button>
        </template>
      </a-space>
    </div>
    <div>
      <p class="setting-title" data-label="布局设置" />
      <div class="setting-item">
        <label> 整体布局 </label>
        <a-radio-group v-model:value="app.appConfig.layout">
          <a-radio-button value="default">默认</a-radio-button>
          <a-radio-button value="horizon">水平</a-radio-button>
        </a-radio-group>
      </div>
      <div class="setting-item">
        <label> 组件方向 </label>
        <a-radio-group v-model:value="app.appConfig.direction">
          <a-radio-button value="ltr">LTR</a-radio-button>
          <a-radio-button value="rtl">RTL</a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <div>
      <p class="setting-title" data-label="Layout" />
      <div class="setting-item">
        <label> 系統颜色 </label>
        <a-button @click="app.toggleDarkMode">切换模式{{ app.darkModeComp }}</a-button>
      </div>
      <div class="setting-item">
        <label> 文字大小 </label>
        <a-input-number v-model:value="app.appConfig.token.fontSize"></a-input-number>
      </div>
      <div class="setting-item">
        <label> 圆角设置 </label>
        <a-input-number v-model:value="app.appConfig.token.borderRadius"></a-input-number>
      </div>
      <div class="setting-item">
        <label> 线框风格 </label>
        <a-switch v-model:checked="app.appConfig.token.wireframe" checked-children="开" un-checked-children="关" />
      </div>
      <div class="setting-item">
        <label> 紧凑模式 </label>
        <a-switch v-model:checked="app.appConfig.compactAlgorithm" checked-children="开" un-checked-children="关" />
      </div>
      <div class="setting-item">
        <label> 水印开关 </label>
        <a-switch v-model:checked="app.appConfig.watermark.isShow" checked-children="开" un-checked-children="关" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setting-drawer {
  display: flex;
  flex-direction: column;

  & :deep(.color-picker) {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 50px;
    height: 50px;
    background-color: transparent;
    border: none;
    cursor: pointer;

    &::-webkit-color-swatch {
      border-radius: 15px;
      border: none;
    }

    &::-moz-color-swatch {
      border-radius: 15px;
      border: none;
    }
  }

  & :deep(.setting-title) {
    width: 100%;
    height: 1px;
    background: #333;
    position: relative;
    margin: 25px 0;

    &::before {
      content: attr(data-label);
      position: absolute;
      left: 10%;
      top: 0;
      transform: translateY(-50%);
      padding: 0 15px;
      background: #fff;
      color: #666;
      font-size: 15px;
    }
  }

  & :deep(.setting-item) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    & .ant-input {
      width: 40%;
    }

    label {
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
