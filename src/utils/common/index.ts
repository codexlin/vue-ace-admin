import { Modal, type ModalFuncProps } from 'ant-design-vue'
import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue'
import { createVNode } from 'vue'

// 模态框图标映射
const ModalIcons = {
  info: InfoCircleOutlined,
  success: CheckCircleOutlined,
  warning: WarningOutlined,
  error: CloseCircleOutlined,
  confirm: ExclamationCircleOutlined
}

// 错误处理器类型
type ErrorHandler = (error: unknown) => void

// 扩展Modal属性接口
export interface IModalProps extends ModalFuncProps {
  errorHandler?: ErrorHandler
  onOk?: () => void | Promise<void>
}

// 默认错误处理
const defaultErrorHandler: ErrorHandler = (error) => {
  console.error('Modal operation error:', error)
}

// 默认确认操作
const defaultOk = () => {
  console.log('Modal confirmed')
}

// 默认取消操作
const defaultCancel = () => {
  console.log('Modal cancelled')
}

// Utility function to show a confirmation dialog
export const showModalConfirm = (props: IModalProps) => {
  const modalProps: ModalFuncProps = {
    title: 'Are you sure?',
    icon: createVNode(ModalIcons.confirm),
    okText: 'Yes',
    okType: 'primary',
    cancelText: 'No',
    ...props,
    async onOk() {
      try {
        await (props.onOk || defaultOk)()
      } catch (error) {
        ;(props.errorHandler || defaultErrorHandler)(error)
      }
    },
    onCancel: props.onCancel || defaultCancel
  }
  Modal.confirm(modalProps)
}

export const showModalInfo = (props: IModalProps) => {
  const modalProps: ModalFuncProps = {
    icon: createVNode(ModalIcons.info),
    okText: 'OK',
    ...props,
    async onOk() {
      try {
        await (props.onOk || defaultOk)()
      } catch (error) {
        ;(props.errorHandler || defaultErrorHandler)(error)
      }
    }
  }
  Modal.info(modalProps)
}

export const showModalSuccess = (props: IModalProps) => {
  const modalProps: ModalFuncProps = {
    icon: createVNode(ModalIcons.success),
    okText: 'OK',
    ...props,
    async onOk() {
      try {
        await (props.onOk || defaultOk)()
      } catch (error) {
        ;(props.errorHandler || defaultErrorHandler)(error)
      }
    }
  }
  Modal.success(modalProps)
}

export const showModalWarning = (props: IModalProps) => {
  const modalProps: ModalFuncProps = {
    icon: createVNode(ModalIcons.warning),
    okText: 'OK',
    ...props,
    async onOk() {
      try {
        await (props.onOk || defaultOk)()
      } catch (error) {
        ;(props.errorHandler || defaultErrorHandler)(error)
      }
    }
  }
  Modal.warning(modalProps)
}

export const showModalError = (props: IModalProps) => {
  const modalProps: ModalFuncProps = {
    icon: createVNode(ModalIcons.error),
    okText: 'OK',
    ...props,
    async onOk() {
      try {
        await (props.onOk || defaultOk)()
      } catch (error) {
        ;(props.errorHandler || defaultErrorHandler)(error)
      }
    }
  }
  Modal.error(modalProps)
}

// 统一的模态框创建函数
export const createModal = (type: 'info' | 'success' | 'warning' | 'error' | 'confirm', props: IModalProps) => {
  switch (type) {
    case 'info':
      return showModalInfo(props)
    case 'success':
      return showModalSuccess(props)
    case 'warning':
      return showModalWarning(props)
    case 'error':
      return showModalError(props)
    case 'confirm':
    default:
      return showModalConfirm(props)
  }
}
