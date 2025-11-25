/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-09 21:03:39
 * @Description:
 */
/// <reference types="vite/client" />

/**
 * 环境变量类型定义
 */
interface ImportMetaEnv {
  /** API基础路径 */
  readonly VITE_APP_BASE_API: string
  /** 是否使用Hash路由 */
  readonly VITE_HASH_ROUTE: string
  /** 是否移除console */
  readonly VITE_BUILD_DROP_CONSOLE: string
  /** 构建压缩类型 (gzip,brotli) */
  readonly VITE_BUILD_COMPRESS: string
  /** 应用标题 */
  readonly VITE_APP_TITLE: string
  /** 开发模式 */
  readonly DEV: boolean
  /** 生产模式 */
  readonly PROD: boolean
  /** SSR模式 */
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 第三方库类型声明
declare module 'nprogress' {
  interface NProgressOptions {
    minimum?: number
    template?: string
    easing?: string
    speed?: number
    trickle?: boolean
    trickleSpeed?: number
    showSpinner?: boolean
    parent?: string
  }

  interface NProgress {
    start(): NProgress
    done(force?: boolean): NProgress
    set(n: number): NProgress
    inc(amount?: number): NProgress
    configure(options: NProgressOptions): NProgress
    status: number | null
  }

  const nprogress: NProgress
  export default nprogress
}

// Vue组件类型声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}
