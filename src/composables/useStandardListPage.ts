import { ref, computed, h } from 'vue'
import { useList, useLoading } from '@codexlin/ace-admin-hooks'
import { ProButton } from '@codexlin/ace-admin-ui'
import type { ListPageConfig, ActionConfig, TableAction } from '@/types/template'

export function useStandardListPage<T = any>(config: ListPageConfig) {
  const { loading, setLoading } = useLoading()

  // 搜索表单数据
  const searchForm = ref<Record<string, any>>({})

  // 初始化搜索表单默认值
  if (config.searchFields) {
    config.searchFields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        searchForm.value[field.name] = field.defaultValue
      }
    })
  }

  // 使用现有的 useList Hook
  const { dataSource, loadData, total, curPage, pageSize } = useList<T>({
    request: config.api,
    filters: {
      state: searchForm,
      autoWatch: true,
      resetPageOnChange: true,
      debounce: config.debounce || 500
    },
    extra: {
      immediate: config.immediate ?? true
    }
  })

  // 处理表格操作
  const handleTableAction = async (action: ActionConfig | TableAction, record?: T) => {
    try {
      // 确认弹窗处理
      if ('confirm' in action && action.confirm) {
        const confirmed = await new Promise<boolean>((resolve) => {
          Modal.confirm({
            title: action.confirm?.title || '确认操作',
            content: action.confirm?.content || '确定要执行此操作吗？',
            okText: action.confirm?.okText || '确定',
            cancelText: action.confirm?.cancelText || '取消',
            onOk: () => resolve(true),
            onCancel: () => resolve(false)
          })
        })

        if (!confirmed) return
      }

      // 执行操作
      await action.handler(record)
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  // 标准化的表格列配置
  const tableColumns = computed(() => {
    const columns = config.tableColumns ? [...config.tableColumns] : []

    // 添加操作列
    if (config.rowActions && config.rowActions.length > 0) {
      columns.push({
        title: '操作',
        key: 'actions',
        width: 200,
        fixed: 'right',
        align: 'center',
        customRender: ({ record }: { record: T }) => {
          const actions = config
            .rowActions!.filter((action) => {
              // 检查显示条件
              if ('show' in action && typeof action.show === 'function') {
                return action.show(record)
              }
              return true
            })
            .filter((action) => {
              // 检查禁用条件
              if ('disabled' in action && typeof action.disabled === 'function') {
                return !action.disabled(record)
              }
              return true
            })

          return h(
            'div',
            { class: 'table-actions' },
            actions.map((action) => {
              const props: any = {
                key: action.key || action.label,
                type: action.type || 'link',
                size: 'small',
                danger: action.danger || false,
                onClick: () => handleTableAction(action, record)
              }

              return h(ProButton, props, () => action.label)
            })
          )
        }
      })
    }

    return columns
  })

  // 工具栏操作
  const handleToolbarAction = async (action: ActionConfig) => {
    await handleTableAction(action)
  }

  // 标准CRUD操作的快捷方法
  const handleCreate = () => {
    console.log('Navigate to create page')
  }

  const handleEdit = (record: T) => {
    console.log('Navigate to edit page:', record)
  }

  const handleDelete = async (record: T) => {
    setLoading(true)
    try {
      // 这里应该调用删除API
      console.log('Delete record:', record)
      await loadData() // 刷新列表
    } finally {
      setLoading(false)
    }
  }

  // 搜索相关方法
  const handleSearch = (formData: Record<string, any>) => {
    Object.assign(searchForm.value, formData)
  }

  const handleReset = () => {
    // 重置为默认值
    if (config.searchFields) {
      const resetForm: Record<string, any> = {}
      config.searchFields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          resetForm[field.name] = field.defaultValue
        } else {
          resetForm[field.name] = ''
        }
      })
      searchForm.value = resetForm
    } else {
      Object.keys(searchForm.value).forEach((key) => {
        searchForm.value[key] = ''
      })
    }
  }

  return {
    // 数据状态
    searchForm,
    dataSource,
    loading,
    total,
    curPage,
    pageSize,
    tableColumns,

    // 方法
    loadData,
    handleSearch,
    handleReset,
    handleToolbarAction,
    handleCreate,
    handleEdit,
    handleDelete,
    handleTableAction
  }
}
