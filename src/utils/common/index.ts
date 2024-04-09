import { Modal, type ModalFuncProps } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { createVNode } from 'vue'

// Utility function to show a confirmation dialog
export const showModalConfirm = ({
  title = 'Are you sure?',
  icon = createVNode(ExclamationCircleOutlined),
  content = '',
  okText = 'Yes',
  okType = 'primary',
  cancelText = 'No',
  okButtonProps = {},
  onOk = () => console.log('OK'),
  onCancel = () => console.log('Cancel'),
  ...rest
}: ModalFuncProps) => {
  const modalProps = {
    title,
    icon,
    content,
    okText,
    okType,
    cancelText,
    async onOk() {
      try {
        await onOk()
      } catch (error) {
        console.error('showModalConfirmError:', error)
      }
    },
    onCancel,
    okButtonProps,
    ...rest
  }
  Modal.confirm(modalProps)
}
