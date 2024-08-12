const globalConfig: any = {
  // zhCN: 简体中文  enUS: 英文
  defaultLanguage: 'zhCN',
  appTitle: 'Ace Admin',
  // 组件方向 具体支持方向切换的组件请参考antd
  direction: 'ltr',
  // 布局
  layout: 'default',
  // 是否展示面包屑
  showBreadCrumb: true,
  // 是否展示标签页
  showTabs: true,
  // 标签页模式 default: 定制模式  antd: 原生模式
  tabsMode: 'default',
  // 是否固定头部
  fixedHeader: false,
  // 水印相关 具体可参考antd的水印组件
  watermark: {
    isShow: true,
    font: {
      fontSize: 16,
      // color: 'rgba(0,0,0,.15)',
      fontWeight: 'bold'
    },
    content: ['Ace Admin', 'By AceLin'],
    zIndex: 11,
    rotate: -22,
    gap: [100, 100] as [number, number],
    offset: []
  }
}
export default globalConfig
