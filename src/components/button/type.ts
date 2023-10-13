import type { ButtonProps } from 'ant-design-vue'

export interface Props extends ButtonProps {
  autoLoading?: boolean
  onClick?: (event: Event, done?: () => void) => void | Promise<any>
}
