/**
 * 统一日志工具
 * 开发环境显示日志，生产环境只显示错误
 */

const isDev = import.meta.env.DEV

export const logger = {
  /**
   * 普通日志 - 仅开发环境
   */
  log: (...args: any[]): void => {
    if (isDev) {
      console.log(...args)
    }
  },

  /**
   * 警告日志 - 仅开发环境
   */
  warn: (...args: any[]): void => {
    if (isDev) {
      console.warn(...args)
    }
  },

  /**
   * 错误日志 - 所有环境
   */
  error: (...args: any[]): void => {
    console.error(...args)
  },

  /**
   * 信息日志 - 仅开发环境
   */
  info: (...args: any[]): void => {
    if (isDev) {
      console.info(...args)
    }
  },

  /**
   * 调试日志 - 仅开发环境
   */
  debug: (...args: any[]): void => {
    if (isDev) {
      console.debug(...args)
    }
  }
}

export default logger
