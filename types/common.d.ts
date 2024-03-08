export type Routes = RouteRecordRaw[]
export type Route = RouteRecordRaw
export interface ILoginForm {
  email: string
  password: string
  captcha: string
}
export interface ILoginData {
  token: string
  permissions?: string[]
  menus?: null
  user?: IUser
}
export interface IUser {
  email: string
  role: null
  userName: string
  [property: string]: any
}
