import { getMenuList } from '@/views/system/api'
import { i18n } from '@/locales'

interface MenuItem {
  id: number
  parentId: number
  title: string
}

class TreeNode {
  value: number
  label: string
  children: TreeNode[]

  constructor(value: number, label: string, children: TreeNode[] = []) {
    this.value = value
    this.label = i18n.global.t(label)
    this.children = children
  }
}

export function buildTree(menuItems: MenuItem[], parentId: number): TreeNode[] {
  const itemMap = new Map<number, MenuItem[]>()

  // 根据 parentId 对菜单项进行分组
  for (const item of menuItems) {
    if (!itemMap.has(item.parentId)) {
      itemMap.set(item.parentId, [])
    }
    itemMap.get(item.parentId)?.push(item)
  }

  // 一个递归函数，用于构建树结构
  function buildSubTree(parentId: number): TreeNode[] {
    const children = itemMap.get(parentId) || []
    return children.map((child) => new TreeNode(child.id, child.title, buildSubTree(child.id)))
  }

  return buildSubTree(parentId)
}

export async function buildTreeDataSelect(): Promise<TreeNode[]> {
  try {
    const res = await getMenuList<MenuItem[]>()
    return buildTree(res?.data || [], 0)
  } catch (error) {
    console.error('Failed to load menu data:', error)
    return []
  }
}
