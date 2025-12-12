import { shallowRef } from 'vue'

import type { ColumnsType } from 'ant-design-vue/es/table'

import { OperationButtons, SvgIcon } from '@/components'
import useLocalI18n from '@/hooks/useLocalI18n'

export function useConfig(handleClick: (record: any, type: 'add' | 'edit' | 'delete') => void) {
  const { tt } = useLocalI18n()
  const open = shallowRef(false)
  const toggleOpen = () => {
    open.value = !open.value
  }
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      hidden: true
    },
    {
      title: '菜单名称',
      dataIndex: 'title',
      key: 'title',
      customRender: ({ text }: any) => {
        return <span>{tt(text)}</span>
      }
    },
    {
      title: '路由名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '路由路径',
      dataIndex: 'path',
      key: 'path'
    },
    {
      title: 'isFrame',
      dataIndex: 'isFrame',
      key: 'isFrame',
      customRender: ({ text }: any) => {
        return <span>{text === '0' ? tt('common.yes') : tt('common.no')}</span>
      }
    },
    {
      title: 'isCache',
      dataIndex: 'isCache',
      key: 'isCache',
      customRender: ({ text }: any) => {
        return <span>{text === '0' ? tt('common.yes') : tt('common.no')}</span>
      }
    },
    {
      title: '类型',
      dataIndex: 'menuType',
      key: 'menuType',
      customRender: ({ text }: any) => {
        return <a-tag color="#87d068">{text}</a-tag>
      }
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      key: 'permission'
    },
    {
      title: '菜单图标',
      dataIndex: 'icon',
      key: 'icon',
      customRender: ({ record }: any) => {
        return <SvgIcon name={record.icon} />
      }
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      key: 'component'
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      key: 'orderNum'
    },
    {
      title: tt('common.operation'),
      dataIndex: 'operation',
      key: 'operation',
      width: '10%',
      fixed: 'right',
      customRender: ({ record }) => {
        const items = [
          {
            auth: 'sys:menu:add',
            text: tt('common.add'),
            type: 'primary',
            cb: () => {
              handleClick(record, 'add')
            }
          },
          {
            auth: 'sys:menu:edit',
            text: tt('common.edit'),
            type: 'primary',
            cb: () => {
              handleClick(record, 'edit')
            }
          },
          {
            auth: 'sys:menu:add',
            text: tt('common.delete'),
            type: 'danger',
            cb: () => {
              handleClick(record, 'delete')
            }
          }
        ]
        return <OperationButtons items={items} />
      }
    }
  ] as ColumnsType<any>
  return { columns, open, toggleOpen }
}
