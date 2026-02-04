import type { PermissionTreeNode } from '@/types/system'

export function flattenPermissions(nodes: PermissionTreeNode[]): PermissionTreeNode[] {
  const result: PermissionTreeNode[] = []
  const stack = [...nodes]
  while (stack.length > 0) {
    const node = stack.shift()
    if (!node) {
      continue
    }
    result.push(node)
    if (node.children && node.children.length > 0) {
      stack.unshift(...node.children)
    }
  }
  return result
}

export function collectDescendantIds(node: PermissionTreeNode): number[] {
  const ids: number[] = [node.id]
  if (!node.children || node.children.length === 0) {
    return ids
  }
  node.children.forEach((child) => {
    ids.push(...collectDescendantIds(child))
  })
  return ids
}

export function normalizeSelection(selected: Set<number>, parentMap: Map<number, number>) {
  const normalized = new Set(selected)
  selected.forEach((id) => {
    let parentId = parentMap.get(id)
    while (parentId && parentId !== 0) {
      normalized.add(parentId)
      parentId = parentMap.get(parentId)
    }
  })
  return normalized
}

export function areSetsEqual(a: Set<number>, b: Set<number>) {
  if (a.size !== b.size) {
    return false
  }
  for (const value of a) {
    if (!b.has(value)) {
      return false
    }
  }
  return true
}
