import type { ButtonProps, PopconfirmProps } from 'ant-design-vue'

export interface PopProps {
  popConfig?: PopconfirmProps
}
export interface Props extends ButtonProps {
  autoLoading?: boolean
  enableConfirm?: boolean
  popConfig?: PopconfirmProps
  onClick?: (event: Event, done?: () => void) => void | Promise<any>
}
