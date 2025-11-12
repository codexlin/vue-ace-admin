export interface Item {
  key: string
  label: string
  onClick?: () => void
  disabled?: boolean
}

export interface Items {
  items: Item[]
}
