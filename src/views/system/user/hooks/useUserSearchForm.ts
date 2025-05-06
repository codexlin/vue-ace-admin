import { ref } from 'vue'

interface SearchFormState {
  name?: string
  age?: number
  gender?: string
}
// 职责：表单字段定义 默认值设置 搜索与重置操作处理

export default function useUserSearchForm(onSearch: (form: SearchFormState) => void, onResetCallback?: () => void) {
  // 默认表单值
  const defaultValues: SearchFormState = {
    name: '默认姓名',
    age: 25,
    gender: 'male'
  }

  // 表单字段配置
  const fields = ref([
    { name: 'name', label: '姓名', component: 'a-input', props: { placeholder: '请输入姓名' } },
    { name: 'age', label: '年龄', component: 'a-input-number', props: { placeholder: '请输入年龄' } },
    {
      name: 'gender',
      label: '性别',
      component: 'a-select',
      props: {
        options: [
          { value: 'male', label: '男' },
          { value: 'female', label: '女' }
        ]
      }
    }
  ])

  // 事件处理函数
  const handleSearch = (formState: SearchFormState) => {
    console.log('[SearchForm] 搜索条件:', formState)
    onSearch(formState)
  }

  const handleReset = () => {
    console.log('[SearchForm] 表单已重置')
    onResetCallback?.()
  }

  return {
    fields,
    defaultValues,
    handleSearch,
    handleReset
  }
}
