import { getRoleList } from '../../api'
import { OperationButtons } from '@/components'

export default function useRoleList(handleClick: any) {
  const { tt } = useLocalI18n()
  const { dataSource, loadData, loading } = useList({ listRequestFn: getRoleList })
  const columns = [
    { title: '角色ID', dataIndex: 'id' },
    { title: '角色名称', dataIndex: 'roleName' },
    { title: '角色状态', dataIndex: 'status' },
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
  return { dataSource, loadData, loading, columns }
}
