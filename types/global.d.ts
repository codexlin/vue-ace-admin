declare type Routes = RouteRecordRaw[]
declare type Route = RouteRecordRaw

declare interface ILoginForm {
  email: string
  password: string
  captcha: string
}

declare interface ILoginData {
  token: string
  permissions?: string[]
  menus: Routes
  user?: IUser
}

declare interface IUser {
  email: string
  role: null
  userName: string

  [property: string]: any
}
