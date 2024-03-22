import { getMenuList } from '@/views/system/api'

interface MenuItem {
  id: number
  parentId: number
  title: string
}

class TreeNode {
  value: number
  label: string
  children: TreeNode[]

  constructor(value: number, label: string) {
    this.value = value
    this.label = label
    this.children = []
  }
}
export function buildTree(menuItems: MenuItem[], parentId: number, tt: (str: string) => string): TreeNode[] {
  const nodes: TreeNode[] = []
  for (const menuItem of menuItems) {
    if (menuItem.parentId === parentId) {
      const node = new TreeNode(menuItem.id, tt(menuItem.title))
      const children = buildTree(menuItems, menuItem.id, tt)
      if (children.length > 0) {
        node.children = children
      }
      nodes.push(node)
    }
  }
  return nodes
}

export async function buildTreeDataSelect(tt: (str: string) => string) {
  const res = await getMenuList()
  return buildTree(res as any, 0, tt)
}
