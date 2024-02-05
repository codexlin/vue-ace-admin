interface Props {
  showBreadcrumb?: Boolean
  showLogo?: Boolean
  mode?: 'inline' | 'horizontal'
}

const headerConfig = ref<Props>({})

export default function useConfig() {
  const setHeaderConfig = (data: Props) => {
    headerConfig.value = data
  }
  return { headerConfig, setHeaderConfig }
}
