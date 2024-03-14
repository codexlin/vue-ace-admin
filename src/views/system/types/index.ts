/**
 * Request
 */
export interface IMenu {
  /**
   * 组件所在路径
   */
  component?: null | string
  /**
   * 菜单状态（0显示 1隐藏）
   */
  hidden?: MenuHidden
  /**
   * 菜单图标
   */
  icon?: null | string
  /**
   * 主键ID
   */
  id: number
  /**
   * 是否缓存（0缓存 1不缓存）
   */
  isCache?: number
  /**
   * 是否为外链（0是 1否）
   */
  isFrame?: number
  /**
   * 菜单类型（M目录 C菜单 F按钮）
   */
  menuType: MenuType
  /**
   * 菜单名称
   */
  name: string
  /**
   * 显示顺序
   */
  orderNum?: number
  /**
   * 父菜单ID
   */
  parentId: number
  /**
   * 路由地址
   */
  path: string
  /**
   * 权限标识
   */
  permission?: null | string
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 菜单国际化
   */
  title?: string
  [property: string]: any
}

/**
 * 菜单状态（0显示 1隐藏）
 */
export type MenuHidden = '0' | '1'

/**
 * 菜单类型（M目录 C菜单 F按钮）
 */
export type MenuType = 'M' | 'C' | 'B'
