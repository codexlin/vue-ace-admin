<!-- <script setup lang="ts">
import { computed, h, unref, withDefaults, defineProps } from 'vue'
import BasicButton from './BasicButton.vue'
import { Popconfirm } from 'ant-design-vue'
import { extendSlots } from '/@/utils/helper/tsxHelper'
import { omit } from 'lodash-es'
import { useAttrs } from '@vben/hooks'
import { useI18n } from '/@/hooks/web/useI18n'

const props = withDefaults(
  defineProps({
    /**
     * Whether to enable the drop-down menu
     * @default: true
     */
    enable: {
      type: Boolean,
      default: true
    }
  }),
  {
    enable: true
  }
)

const { t } = useI18n()
const attrs = useAttrs()

// get inherit binding value
const getBindValues = computed(() => {
  return Object.assign(
    {
      okText: t('common.okText'),
      cancelText: t('common.cancelText')
    },
    { ...props, ...unref(attrs) }
  )
})
</script>

<template>
  <template v-if="!props.enable">
    <BasicButton v-bind="omit(unref(getBindValues), 'icon')" v-slots="extendSlots($slots)" />
  </template>
  <template v-else>
    <Popconfirm v-bind="unref(getBindValues)">
      <BasicButton v-bind="omit(unref(getBindValues), 'icon', 'title')" v-slots="extendSlots($slots)" />
    </Popconfirm>
  </template>
</template> -->
