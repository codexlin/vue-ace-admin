import { resolveDirective, withDirectives, type SetupContext } from 'vue'
/** 封装@vueuse/motion动画库中的自定义指令v-motion */
type FComponentProps = {
  delay: number
}
export default function Motion(props: FComponentProps, { slots }: SetupContext) {
  const { delay } = props
  const motion = resolveDirective('motion')
  const vNode = <div>{slots.default?.()}</div>
  return withDirectives(vNode, [
    [
      motion,
      {
        initial: { opacity: 0, y: 100 },
        enter: {
          opacity: 1,
          y: 0,
          transition: {
            delay
          }
        }
      }
    ]
  ])
}

Motion.props = {
  delay: {
    type: Number,
    default: 50
  }
}
