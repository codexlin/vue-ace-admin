interface Props {
  showBreadcrumb?: boolean
  showLogo?: boolean
  mode?: 'inline' | 'horizontal'
}

const headerConfig = ref<Props>({})

export default function useConfig() {
  const setHeaderConfig = (data: Props) => {
    headerConfig.value = data
  }
  return { headerConfig, setHeaderConfig }
}
