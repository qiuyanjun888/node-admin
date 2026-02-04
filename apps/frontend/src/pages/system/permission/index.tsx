import { useMemo, useState } from 'react'
import { AlertCircle, ListChecks, RefreshCcw, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { PermissionTreeNode, Role } from '@/types/system'
import { PermissionTree } from './components/PermissionTree'
import { usePermissionActions } from './hooks/usePermissionActions'

function flattenPermissions(nodes: PermissionTreeNode[]): PermissionTreeNode[] {
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

function collectDescendantIds(node: PermissionTreeNode): number[] {
  const ids: number[] = [node.id]
  if (!node.children || node.children.length === 0) {
    return ids
  }
  node.children.forEach((child) => {
    ids.push(...collectDescendantIds(child))
  })
  return ids
}

function normalizeSelection(selected: Set<number>, parentMap: Map<number, number>) {
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

function areSetsEqual(a: Set<number>, b: Set<number>) {
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

export default function PermissionManagement() {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  const [roleKeyword, setRoleKeyword] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [initialSelectedIds, setInitialSelectedIds] = useState<number[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  const { rolesQuery, permissionsQuery, rolePermissionsQuery, updateRolePermissionsMutation } =
    usePermissionActions(selectedRoleId ?? undefined)

  const loadError = (rolesQuery.error ?? permissionsQuery.error) as Error | null
  const permissions = useMemo(() => permissionsQuery.data ?? [], [permissionsQuery.data])

  const parentMap = useMemo(() => {
    const map = new Map<number, number>()
    const traverse = (nodes: PermissionTreeNode[]) => {
      nodes.forEach((node) => {
        map.set(node.id, node.parentId)
        if (node.children && node.children.length > 0) {
          traverse(node.children)
        }
      })
    }
    traverse(permissions)
    return map
  }, [permissions])

  const allPermissionIds = useMemo(() => {
    return flattenPermissions(permissions).map((node) => node.id)
  }, [permissions])

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const initialSelectedIdSet = useMemo(() => new Set(initialSelectedIds), [initialSelectedIds])

  // Sync expanded nodes when permissions change
  const [prevPermissions, setPrevPermissions] = useState<PermissionTreeNode[]>([])
  if (permissions !== prevPermissions) {
    setPrevPermissions(permissions)
    if (permissions.length > 0) {
      const nodesWithChildren = flattenPermissions(permissions)
        .filter((node) => node.children && node.children.length > 0)
        .map((node) => node.id)
      setExpandedIds(new Set(nodesWithChildren))
    }
  }

  // Synchronize role selection and permissions
  const [prevRoleData, setPrevRoleData] = useState<Role[] | null>(null)
  const currentRoles = useMemo(() => rolesQuery.data?.items ?? [], [rolesQuery.data?.items])
  if (currentRoles !== prevRoleData) {
    setPrevRoleData(currentRoles)
    if (currentRoles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(currentRoles[0].id)
    }
  }

  const [prevRolePerms, setPrevRolePerms] = useState<number[] | null>(null)
  if (rolePermissionsQuery.data && rolePermissionsQuery.data !== prevRolePerms) {
    setPrevRolePerms(rolePermissionsQuery.data)
    const normalized = normalizeSelection(new Set(rolePermissionsQuery.data), parentMap)
    const nextIds = Array.from(normalized).sort((a, b) => a - b)
    setSelectedIds(nextIds)
    setInitialSelectedIds(nextIds)
  }

  const filteredRoles = useMemo(() => {
    const roles = currentRoles
    if (!roleKeyword.trim()) {
      return roles
    }
    const keyword = roleKeyword.trim().toLowerCase()
    return roles.filter(
      (role) =>
        role.roleName.toLowerCase().includes(keyword) ||
        role.roleCode.toLowerCase().includes(keyword),
    )
  }, [roleKeyword, currentRoles])

  const isDirty = useMemo(
    () => !areSetsEqual(selectedIdSet, initialSelectedIdSet),
    [selectedIdSet, initialSelectedIdSet],
  )

  const handleTogglePermission = (node: PermissionTreeNode, checked: boolean) => {
    const next = new Set(selectedIdSet)
    const descendantIds = collectDescendantIds(node)
    descendantIds.forEach((id) => {
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
    })

    const normalized = normalizeSelection(next, parentMap)
    setSelectedIds(Array.from(normalized).sort((a, b) => a - b))
  }

  const handleExpandToggle = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleExpandAll = () => {
    const nodesWithChildren = flattenPermissions(permissions)
      .filter((node) => node.children && node.children.length > 0)
      .map((node) => node.id)
    setExpandedIds(new Set(nodesWithChildren))
  }

  const handleCollapseAll = () => {
    setExpandedIds(new Set())
  }

  const handleSelectAll = () => {
    const normalized = normalizeSelection(new Set(allPermissionIds), parentMap)
    setSelectedIds(Array.from(normalized).sort((a, b) => a - b))
  }

  const handleClearAll = () => {
    setSelectedIds([])
  }

  const handleReset = () => {
    setSelectedIds(initialSelectedIds)
  }

  const handleSave = () => {
    if (!selectedRoleId) {
      return
    }
    updateRolePermissionsMutation.mutate({
      roleId: selectedRoleId,
      permissionIds: selectedIds,
    })
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-destructive gap-4">
        <AlertCircle className="w-12 h-12" />
        <p className="font-medium">加载失败: {loadError.message}</p>
        <Button
          variant="outline"
          onClick={() => {
            rolesQuery.refetch()
            permissionsQuery.refetch()
          }}
        >
          重试
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground/90">权限管理</h2>
          <p className="text-muted-foreground mt-1 text-sm">按角色分配菜单与操作权限。</p>
        </div>
        <Button
          className="gap-2 shadow-sm"
          onClick={handleSave}
          disabled={!selectedRoleId || updateRolePermissionsMutation.isPending || !isDirty}
        >
          <Save className="w-4 h-4" />
          保存权限
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">角色列表</h3>
            <span className="text-xs text-muted-foreground">
              共 {rolesQuery.data?.total ?? 0} 个
            </span>
          </div>
          <Input
            placeholder="搜索角色名称或编码"
            value={roleKeyword}
            onChange={(event) => setRoleKeyword(event.target.value)}
          />
          <div className="space-y-2 max-h-[480px] overflow-y-auto">
            {(rolesQuery.isLoading ? [] : filteredRoles).map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRoleId(role.id)}
                className={cn(
                  'w-full text-left rounded-lg border px-3 py-2 transition-colors',
                  selectedRoleId === role.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:bg-muted/40',
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{role.roleName}</div>
                    <div className="text-xs text-muted-foreground font-mono">{role.roleCode}</div>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      role.status === 1 ? 'text-emerald-600' : 'text-muted-foreground',
                    )}
                  >
                    {role.status === 1 ? '启用' : '禁用'}
                  </span>
                </div>
              </button>
            ))}
            {rolesQuery.isLoading ? (
              <div className="text-sm text-muted-foreground">角色加载中...</div>
            ) : null}
            {!rolesQuery.isLoading && filteredRoles.length === 0 ? (
              <div className="text-sm text-muted-foreground">暂无匹配角色</div>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">权限树</h3>
              <span className="text-xs text-muted-foreground">
                已选 {selectedIdSet.size} / {allPermissionIds.length}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExpandAll}>
                全部展开
              </Button>
              <Button variant="outline" size="sm" onClick={handleCollapseAll}>
                全部收起
              </Button>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                全选
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                清空
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset} disabled={!isDirty}>
                <RefreshCcw className="w-4 h-4" />
                重置
              </Button>
            </div>
          </div>

          {selectedRoleId ? (
            <div className="rounded-lg border bg-background/50 p-3">
              <div className="text-xs text-muted-foreground">
                当前角色:{' '}
                {
                  (rolesQuery.data?.items ?? []).find((role) => role.id === selectedRoleId)
                    ?.roleName
                }
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
              请选择左侧角色后分配权限
            </div>
          )}

          {permissionsQuery.isLoading ? (
            <div className="text-sm text-muted-foreground">权限加载中...</div>
          ) : null}

          {selectedRoleId && rolePermissionsQuery.isFetching ? (
            <div className="text-sm text-muted-foreground">正在加载角色权限...</div>
          ) : null}

          {!permissionsQuery.isLoading && permissions.length === 0 ? (
            <div className="text-sm text-muted-foreground">暂无权限数据</div>
          ) : null}

          {permissions.length > 0 ? (
            <PermissionTree
              nodes={permissions}
              selectedIds={selectedIdSet}
              expandedIds={expandedIds}
              onToggle={handleTogglePermission}
              onToggleExpand={handleExpandToggle}
            />
          ) : null}

          {updateRolePermissionsMutation.error ? (
            <div className="text-sm text-destructive">
              保存失败: {(updateRolePermissionsMutation.error as Error).message}
            </div>
          ) : null}

          {updateRolePermissionsMutation.isSuccess ? (
            <div className="text-sm text-emerald-600">权限已保存</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
