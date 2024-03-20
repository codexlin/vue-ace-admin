import { omit } from 'lodash-es'
import { createVNode } from 'vue'

interface IItem {
  label: string
  name: string
  ui: string
  disabled: boolean
}
export default defineComponent(
  (props, { slots }) => {
    const { formItems } = toRefs(props)
    const formState = reactive<Record<string, any>>({})
    const change = () => {
      console.log('formState:', formState)
    }
    const components = (item: IItem) => {
      // 根据ui创建vNode
      const vNode = createVNode(h(resolveComponent(item.ui)))
      const rest = omit(item, ['name', 'label'])
      const component = <vNode v-model={[formState[item.name], 'value']} onChange={change} {...rest} />
      return component
    }
    return () => (
      <a-form model={formState}>
        {formItems.value.map((item) => {
          return (
            <a-form-item {...item} key={item.name}>
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
