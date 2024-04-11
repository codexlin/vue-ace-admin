import { omit } from 'lodash-es'

interface IItem {
  label: string
  name: string
  ui: string
  defaultValue?: string | number
  disabled?: boolean

  [key: string]: any
}
// 提供给ref使用
export interface IFormModal {
  formState: Record<string, any>
}
export default defineComponent(
  (props, { expose }) => {
    const { formItems } = toRefs(props)
    const formState = reactive<Record<string, any>>({})
    const change = () => {
      console.log('formState:', formState)
    }
    console.log('formItems', formItems.value)
    const components = (item: IItem) => {
      if (!formState[item.name] && item.defaultValue) {
        formState[item.name] = item.defaultValue
      }
      // 根据ui创建vNode 这里使用resolveComponent来动态引入组件
      return h(resolveComponent(item.ui), {
        value: formState[item.name],
        ['onUpdate:value']: (value: unknown) => {
          formState[item.name] = value
        },
        onChange: change,
        ...omit(item, ['name', 'label', 'ui', 'defaultValue'])
      })
    }
    // 注意：vue 对于tsx中使用expose的支持不够完善 会导致instance type of 拿不到正确的类型，所以我们需要自己定义expose导出的类型 如上
    expose({ formState })

    return () => (
      <a-form model={formState}>
        {formItems.value.map((item) => {
          const { name, label } = item
          return (
            <a-form-item name={name} label={label} key={name}>
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
