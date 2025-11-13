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

// QQ SDK 类型声明
interface QC {
  Login: {
    showPopup: () => void
  }
}

declare global {
  interface Window {
    QC?: QC
  }
}
