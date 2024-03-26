import { omit } from 'lodash-es'
import { createVNode } from 'vue'

interface IItem {
  label: string
  name: string
  ui: string
  defaultValue?: string | number
  disabled?: boolean

  [key: string]: any
}

export default defineComponent(
  (props, { expose }) => {
    const { formItems } = toRefs(props)
    const formState = reactive<Record<string, any>>({})
    const change = () => {
      console.log('formState:', formState)
    }
    console.log('formItems', formItems.value)
    expose({
      formState
    })
    const components = (item: IItem) => {
      // 根据ui创建vNode
      const vNode = createVNode(h(resolveComponent(item.ui)))
      const rest = omit(item, ['name', 'label'])
      if (item.defaultValue) formState[item.name] = item.defaultValue
      return <vNode v-model={[formState[item.name], 'value']} onChange={change} {...rest} />
    }
    return () => (
      <a-form model={formState}>
        {formItems.value.map((item) => {
          const { name, label } = item
          return (
            <a-form-item name={name} label={label}>
              {components(item)}
            </a-form-item>
          )
        })}
      </a-form>
    )
  },
  {
    name: 'FormModal',
    props: {
      formItems: {
        type: Array as PropType<IItem[]>,
        default: () => []
      }
    }
  }
)
