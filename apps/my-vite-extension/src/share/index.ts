export const sleep = (ms: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export function arrayToTree(arr: Array<any>): Array<any> {
  const map: Record<string, any> = {} // 用于存储每个节点的引用，键为id
  const roots = [] // 存储根节点数组

  for (const item of arr) {
    // 处理当前节点，合并属性（如果已存在）
    let node = map[item.id]
    if (!node) {
      node = { ...item, children: [] }
      map[item.id] = node
    } else {
      Object.assign(node, item) // 合并属性，保留已存在的children
    }

    // 判断是否为根节点
    if (item.parent_id === '0') {
      roots.push(node)
    } else {
      // 处理父节点，若不存在则创建临时父节点
      let parent = map[item.parent_id]
      if (!parent) {
        parent = { id: item.parent_id, children: [] }
        map[item.parent_id] = parent
      }
      parent.children.push(node)
    }
  }

  return roots
}
