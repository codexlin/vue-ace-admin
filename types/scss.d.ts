declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}
//example one
declare module '*.scss'

//example two
declare module '*.scss' {
  const content: any
  export default content
}

//example three
declare module '*.scss' {
  const content: Record<string, string>
  export default content
}

//example four
declare module '*.scss' {
  const content: { [key: string]: any }
  export = content
}
declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}
