export interface Item {
  auth: string
  text: string
  type?: string
  cb: () => void | Promise<void>
  btnName?: string
  btn?: string
}

export interface Items {
  items: Item[]
}
