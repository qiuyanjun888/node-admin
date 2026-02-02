import { http, HttpResponse } from 'msw'
import type { PermissionTreeNode } from '@/types/system'

const seedTree: PermissionTreeNode[] = [
  {
    id: 1,
    name: '系统管理',
    type: 1,
    parentId: 0,
    path: '/system',
    sortOrder: 1,
    isVisible: 1,
    status: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [
      {
        id: 2,
        name: '用户管理',
        type: 2,
        parentId: 1,
        path: '/system/user',
        component: 'system/user/index',
        sortOrder: 1,
        isVisible: 1,
        status: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [
          {
            id: 10,
            name: '新增用户',
            type: 3,
            parentId: 2,
            sortOrder: 0,
            isVisible: 1,
            permissionCode: 'sys:user:add',
            status: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
      {
        id: 3,
        name: '角色管理',
        type: 2,
        parentId: 1,
        path: '/system/role',
        component: 'system/role/index',
        sortOrder: 2,
        isVisible: 1,
        status: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
]

const permissionTree: PermissionTreeNode[] = JSON.parse(JSON.stringify(seedTree))
let nextId = 100

const rolePermissions: Record<number, number[]> = {
  1: [1, 2, 3, 10],
  2: [1, 3],
}

const flattenPermissions = (nodes: PermissionTreeNode[]) => {
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

const findPermission = (nodes: PermissionTreeNode[], id: number): PermissionTreeNode | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }
    if (node.children) {
      const found = findPermission(node.children, id)
      if (found) {
        return found
      }
    }
  }
  return null
}

const insertPermission = (nodes: PermissionTreeNode[], parentId: number, node: PermissionTreeNode) => {
  if (parentId === 0) {
    nodes.push(node)
    return
  }
  const parent = findPermission(nodes, parentId)
  if (parent) {
    parent.children = parent.children ?? []
    parent.children.push(node)
  } else {
    nodes.push(node)
  }
}

const filterMenuTree = (nodes: PermissionTreeNode[]): PermissionTreeNode[] => {
  return nodes
    .filter((node) => node.type !== 3 && node.isVisible !== 0 && node.status !== 0)
    .map((node) => ({
      ...node,
      children: node.children ? filterMenuTree(node.children) : [],
    }))
}

const filterByRole = (nodes: PermissionTreeNode[], allowedIds: Set<number>): PermissionTreeNode[] => {
  const filtered: PermissionTreeNode[] = []
  nodes.forEach((node) => {
    const children = node.children ? filterByRole(node.children, allowedIds) : []
    if (allowedIds.has(node.id) || children.length > 0) {
      filtered.push({ ...node, children })
    }
  })
  return filtered
}

export const permissionHandlers = [
  http.get('*/system/permissions/tree', () => {
    return HttpResponse.json({
      success: true,
      code: 200,
      message: 'success',
      data: permissionTree,
    })
  }),

  http.get('*/system/permissions', () => {
    return HttpResponse.json({
      success: true,
      code: 200,
      message: 'success',
      data: flattenPermissions(permissionTree),
    })
  }),

  http.get('*/system/permissions/menus', ({ request }) => {
    const url = new URL(request.url)
    const roleId = Number(url.searchParams.get('roleId'))
    const menuTree = filterMenuTree(permissionTree)
    const allowed = !Number.isNaN(roleId) ? new Set(rolePermissions[roleId] ?? []) : null
    const data = allowed ? filterByRole(menuTree, allowed) : menuTree
    return HttpResponse.json({
      success: true,
      code: 200,
      message: 'success',
      data,
    })
  }),

  http.post('*/system/permissions', async ({ request }) => {
    const body = (await request.json()) as Partial<PermissionTreeNode>
    const now = new Date().toISOString()
    const newPermission: PermissionTreeNode = {
      id: nextId++,
      name: body.name ?? '新权限',
      type: body.type ?? 2,
      parentId: body.parentId ?? 0,
      path: body.path,
      component: body.component,
      sortOrder: body.sortOrder ?? 0,
      isVisible: body.isVisible ?? 1,
      permissionCode: body.permissionCode,
      status: body.status ?? 1,
      createdAt: now,
      updatedAt: now,
      children: body.type !== 3 ? [] : undefined,
    }
    insertPermission(permissionTree, newPermission.parentId, newPermission)
    return HttpResponse.json({
      success: true,
      code: 200,
      message: 'success',
      data: newPermission,
    })
  }),

  http.patch('*/system/permissions/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<PermissionTreeNode>
    const id = Number(params.id)
    const target = findPermission(permissionTree, id)
    if (target) {
      Object.assign(target, body, { updatedAt: new Date().toISOString() })
    }
    return HttpResponse.json({
      success: true,
      code: 200,
      message: 'success',
      data: target ?? null,
    })
  }),

  http.delete('*/system/permissions/:id', ({ params }) => {
    const id = Number(params.id)
    const target = findPermission(permissionTree, id)
    if (target) {
      target.status = 0
    }
    return HttpResponse.json({
      success: true,
      code: 200,
      message: 'success',
      data: { id },
    })
  }),

  http.get('*/system/roles/:id/permissions', ({ params }) => {
    const roleId = Number(params.id)
    return HttpResponse.json({
      success: true,
      code: 200,
      message: 'success',
      data: rolePermissions[roleId] ?? [],
    })
  }),

  http.put('*/system/roles/:id/permissions', async ({ params, request }) => {
    const roleId = Number(params.id)
    const body = (await request.json()) as { permissionIds: number[] }
    rolePermissions[roleId] = body.permissionIds ?? []
    return HttpResponse.json({
      success: true,
      code: 200,
      message: 'success',
      data: { roleId, permissionIds: rolePermissions[roleId] },
    })
  }),
]
