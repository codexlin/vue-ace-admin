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
import 'tinymce/plugins/image'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/wordcount' // 文字计数
import 'tinymce/plugins/preview' // 预览
import 'tinymce/plugins/emoticons' // emoji表情
import 'tinymce/plugins/emoticons/js/emojis.js' //必须引入这个文件才有表情图库
import 'tinymce/plugins/link' // 链接插件
import 'tinymce/plugins/advlist' //高级列表
import 'tinymce/plugins/codesample' //代码示例
import 'tinymce/plugins/autoresize' // 自动调整编辑器大小
import 'tinymce/plugins/quickbars' // 光标处快捷提示
import 'tinymce/plugins/nonbreaking' //插入不间断空格
import 'tinymce/plugins/searchreplace' //查找替换
import 'tinymce/plugins/autolink' //自动链接
import 'tinymce/plugins/directionality' //文字方向
import 'tinymce/plugins/visualblocks' //显示元素范围
import 'tinymce/plugins/visualchars' //显示不可见字符
import 'tinymce/plugins/charmap' // 特殊符号
import 'tinymce/plugins/insertdatetime' //插入日期时间
import 'tinymce/plugins/importcss' //引入自定义样式的css文件
import 'tinymce/plugins/accordion' // 可折叠数据手风琴模式
import 'tinymce/plugins/anchor' //锚点
import 'tinymce/plugins/fullscreen' //全屏
import tinymce from 'tinymce'

const editorValue = defineModel({ required: true, type: String, default: '' })
const props = defineProps({
  plugins: {
    type: [String, Array],
    default:
      ' importcss autoresize searchreplace autolink directionality code visualblocks visualchars  image link codesample table  nonbreaking anchor insertdatetime advlist lists wordcount charmap quickbars emoticons accordion fullscreen preview'
  },
  toolbar: {
    type: [String, Array],
    default:
      'undo redo | styles fontfamily fontsize | preview bold italic cut copy paste forecolor backcolor removeformat code accordion accordionremove | blocks |  underline strikethrough ltr rtl  | align numlist bullist | link image | table | lineheight outdent indent | charmap emoticons | anchor codesample fullscreen'
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const initOptions = reactive({
  language: 'zh-Hans',
  height: 500, // 引入autoresize时失效
  min_height: 500,
  branding: false,
  elementPath: false,
  // statusBar: false,
  skin: false,
  menubar: false,
  plugins: props.plugins,
  toolbar: props.toolbar,
  // content_css: '/tinymce/skins/content/default/content.css',   //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
  // 工具栏模式 floating / sliding / scrolling / wrap
  toolbar_mode: 'sliding',
  // 取消图片资源路径转换
  convert_urls: false,
  // table边框位0是否展示网格线
  // visual: false,
  link_default_target: '_blank', // 链接默认打开方式
  link_context_toolbar: true,
  // 默认快捷菜单
  quickbars_insert_toolbar: 'image codesample table',
  // 文字样式
  font_family_formats:
    'Arial=arial,helvetica,sans-serif; 宋体=SimSun; 微软雅黑=Microsoft Yahei; Impact=impact,chicago;',
  font_size_formats: '11px 12px 14px 16px 18px 24px 36px 48px 64px 72px',
  image_caption: true,
  noneditable_class: 'mceNonEditable',
  // 默认样式
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
  image_advtab: true,
  importcss_append: true,
  paste_merge_formats: true,
  nonbreaking_force_tab: false,
  paste_auto_cleanup_on_paste: false,
  file_picker_types: 'file',
  // 选中图片的快捷提示
  quickbars_image_toolbar: 'alignleft aligncenter alignright | rotateleft rotateright | imageoptions',
  editimage_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
  editimage_cors_hosts: ['picsum.photos'],
  // 选中文字的快捷提示
  quickbars_selection_toolbar: 'bold italic quicklink h2 h3 blockquote quickimage quicktable',
  // 编辑器高度自适应
  resize: 'both',
  autoresize_bottom_margin: 20,
  // autoresize_overflow_padding: 16,
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
    images_upload_handler: (blobInfo: any, progress: any) =>
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
    paste_preprocess: (editor: any, args: any) => {
      console.log(args.content)
    },
    // paste_remove_styles_if_webkit: false,
    paste_webkit_styles: 'color'
  }
}
// 设置编辑器只读模式
watchEffect(async () => {
  if (props.readonly) {
    await nextTick()
    tinymce && tinymce.activeEditor && tinymce.activeEditor.mode.set(props.readonly ? 'readonly' : 'design')
  }
})

// 设置值
const handleSetContent = (content: string) => {
  tinymce?.activeEditor?.setContent(content)
}

// 获取值
const handleGetContent = () => {
  return tinymce?.activeEditor?.getContent() || ''
}

defineExpose({
  handleSetContent,
  handleGetContent
})
</script>

<style scoped></style>
