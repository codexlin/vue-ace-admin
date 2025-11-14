import { message as AntMessage } from 'ant-design-vue'

/**
 * 成功消息提示（基于 Ant Design Vue）
 */
export function message(message: string) {
  AntMessage.success(message)
}

/**
 * 警告消息提示（基于 Ant Design Vue）
 */
export function warningMessage(message: string) {
  AntMessage.warning(message)
}

/**
 * 错误消息提示（基于 Ant Design Vue）
 */
export function errorMessage(message: string) {
  AntMessage.error(message)
}

/**
 * 信息消息提示（基于 Ant Design Vue）
 */
export function infoMessage(message: string) {
  AntMessage.info(message)
}
