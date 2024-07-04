<template>
  <div style="width: 100%">
    <editor v-model="editorValue" :init="initOptions" />
  </div>
</template>

<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/tinymce'
import 'tinymce/models/dom'
import 'tinymce/skins/ui/oxide/skin.css'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce-i18n/langs6/zh-Hans.js'
import 'tinymce/plugins/code'

const editorValue = defineModel({ required: true, type: String, default: '' })
const props = defineProps({
  plugins: {
    type: [String, Array],
    default: 'code'
  },
  toolbar: {
    type: [String, Array],
    default: 'undo redo | styles | bold italic cut copy paste forecolor removeformat code'
  }
})

const initOptions = ref({
  language: 'zh-Hans',
  height: 500,
  skin: false,
  menubar: false,
  content_css: false,
  plugins: props.plugins,
  toolbar: props.toolbar,
  toolbar_mode: 'sliding',
  ...getPasteOption(),
  ...getImageOption()
})

onMounted(() => {
  console.log('初始化tinymce')
})

/*
 * 图片上传 配置项
 * */
function getImageOption() {
  return {
    images_upload_handler: (blobInfo, progress) =>
      new Promise(async (resolve, reject) => {
        const formData = new FormData()
        formData.append('file', blobInfo.blob(), blobInfo.filename())
        // 模拟调用图片上传接口之后的结果，返回的数据如下格式
        // 格式非固定，根据业务调整
        const res = {
          code: 200,
          url: 'https://dummyimage.com/600x400'
        }
        if (res.code === 200) {
          // 给出的是url地址
          resolve(res.url)
        } else {
          reject('上传图片失败', res)
        }
      })
  }
}

/*
 *  复制粘贴插件 配置项
 * https://www.tiny.cloud/docs/tinymce/6/copy-and-paste/
 * */
function getPasteOption() {
  return {
    paste_preprocess: (editor, args) => {
      console.log(args.content)
    },
    // paste_remove_styles_if_webkit: false,
    /*
     * 此选项允许您指定在 WebKit 中粘贴时要保留的样式。WebKit 有一个怪癖，
     * 它将获取元素的所有计算 CSS 属性并将它们添加到编辑器中的 span 中。由于大多数用户不希望在整个文档中添加随机跨度，
     * 因此我们需要手动清理它，直到修复错误。此选项默认为'none'但可以设置为'all'或要保留的特定样式列表。
     * */
    paste_webkit_styles: 'color'
  }
}
</script>

<style scoped></style>
