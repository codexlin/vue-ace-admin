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

const { tt } = useLocalI18n('theme')
const reset = () => {
  app.resetDefault()
  color.value = app.appConfig.token.colorPrimary
}
</script>

<template>
  <div class="setting-drawer">
    <a-button type="primary" @click="reset">{{ tt('reset_all') }}</a-button>
    <div>
      <p class="setting-title" :data-label="tt('customize_theme_color')" />
      <input v-model="color" class="color-picker" type="color" @change="handleChange(color)" />
    </div>
    <div>
      <p class="setting-title" :data-label="tt('preset_theme_colors')" />
      <a-space wrap>
        <template v-for="(color, name) in variables" :key="name">
          <a-button :style="{ background: color }" @click="handleChange(color)">
            {{ tt(`colors.${name}`) }}
          </a-button>
        </template>
      </a-space>
    </div>
    <div>
      <p class="setting-title" :data-label="tt('layout_settings')" />
      <div class="setting-item">
        <label> {{ tt('overall_layout') }} </label>
        <a-radio-group v-model:value="app.appConfig.layout">
          <a-radio-button value="default">{{ tt('default') }}</a-radio-button>
          <a-radio-button value="horizon">{{ tt('horizontal') }}</a-radio-button>
        </a-radio-group>
      </div>
      <div class="setting-item">
        <label> {{ tt('component_direction') }} </label>
        <a-radio-group v-model:value="app.appConfig.direction">
          <a-radio-button value="ltr">{{ tt('ltr') }}</a-radio-button>
          <a-radio-button value="rtl">{{ tt('rtl') }}</a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <div>
      <p class="setting-title" data-label="Layout" />
      <div class="setting-item">
        <label> {{ tt('system_color') }} </label>
        <a-button @click="app.toggleDarkMode">{{ `${tt('toggle_mode')}${app.darkModeComp}` }}</a-button>
      </div>
      <div class="setting-item">
        <label> {{ tt('text_size') }} </label>
        <a-input-number v-model:value="app.appConfig.token.fontSize" />
      </div>
      <div class="setting-item">
        <label> {{ tt('corner_setting') }} </label>
        <a-input-number v-model:value="app.appConfig.token.borderRadius" />
      </div>
      <div class="setting-item">
        <label> {{ tt('frame_style') }} </label>
        <a-switch v-model:checked="app.appConfig.token.wireframe" checked-children="开" un-checked-children="关" />
      </div>
      <div class="setting-item">
        <label> {{ tt('compact_mode') }} </label>
        <a-switch v-model:checked="app.appConfig.compactAlgorithm" checked-children="开" un-checked-children="关" />
      </div>
      <div class="setting-item">
        <label> {{ tt('watermark_toggle') }} </label>
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
