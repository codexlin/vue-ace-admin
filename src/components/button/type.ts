import { Interface } from 'readline'
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

export type Item = {
  auth: string
  text: string
  cb: () => void
  type: string
}
export interface Items {
  items: Item[]
}
