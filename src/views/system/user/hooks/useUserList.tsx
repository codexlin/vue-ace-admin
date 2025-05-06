import { getUserList } from '../../api'
import { OperationButtons } from '@/components'

import useList from '@/hooks/useList'
import useLocalI18n from '@/hooks/useLocalI18n'

// 职责：获取用户列表 提供 columns 配置 控制 loading、数据源等
export default function useUserList(handleClick: (record: any, type: string) => void) {
  const { dataSource, loadData, loading } = useList({ listRequestFn: getUserList })
  const { tt } = useLocalI18n()

  const columns = [
    { title: '用户ID', dataIndex: 'id' },
    { title: '用户名称', dataIndex: 'userName' },
    { title: '用户类型', dataIndex: 'userType' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '手机号', dataIndex: 'phone' },
    { title: '性别', dataIndex: 'sex' },
    { title: '状态', dataIndex: 'status' },
    { title: '创建时间', dataIndex: 'createTime' },
    {
      title: '操作',
      dataIndex: 'operation',
      customRender: ({ record }: any) => {
        const items = [
          { auth: 'add', text: tt('common.add'), type: 'primary', cb: () => handleClick(record, 'add') },
          { auth: 'edit', text: tt('common.edit'), type: 'primary', cb: () => handleClick(record, 'edit') },
          { auth: 'delete', text: tt('common.delete'), type: 'danger', cb: () => handleClick(record, 'delete') }
        ]
        return <OperationButtons items={items} />
      }
    }
  ]

  return { columns, dataSource, loadData, loading }
}
