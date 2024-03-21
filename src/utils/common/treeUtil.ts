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

export function buildTree(menuItems: MenuItem[], parentId: number): TreeNode[] {
  const nodes: TreeNode[] = []
  for (const menuItem of menuItems) {
    if (menuItem.parentId === parentId) {
      const node = new TreeNode(menuItem.id, menuItem.title)
      const children = buildTree(menuItems, menuItem.id)
      if (children.length > 0) {
        node.children = children
      }
      nodes.push(node)
    }
  }
  console.log(nodes)
  return nodes
}

export function buildTreeDataSelect() {
  let a = <any>[]
  getMenuList().then((res: any) => (a = buildTree(res, 0)))
  console.log(a)
  return a
}
