interface TreeNode {
  parent?: TreeNode
  value: number
  children?: TreeNode[]
}

export default function useTreePathMap() {
  const valueMap: Record<number, TreeNode> = {}

  function loops(list?: TreeNode[], parent?: TreeNode): TreeNode[] {
    return (list || []).map(({ children, value }) => {
      const node: TreeNode = { parent, value }
      valueMap[value] = node
      node.children = loops(children, node)
      return node
    })
  }

  function getPath(value: number): number[] {
    const path: number[] = []
    let current: TreeNode | undefined = valueMap[value]
    while (current) {
      path.unshift(current.value)
      current = current.parent
    }
    return path
  }

  function filterDeepestNodes(selectedNodes: number[]): number[] {
    const valueSet = new Set(selectedNodes)
    return selectedNodes.filter((value) => {
      const node = valueMap[value]
      return !node?.children?.some((child) => valueSet.has(child.value))
    })
  }

  return {
    valueMap,
    loops,
    getPath,
    filterDeepestNodes
  }
}
