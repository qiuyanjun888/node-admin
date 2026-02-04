import { useMemo, useState } from 'react'
import { AlertCircle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PermissionTreeNode } from '@/types/system'
import { PermissionFormModal, type PermissionFormData } from './components/PermissionFormModal'
import { PermissionManageTree } from './components/PermissionManageTree'
import { useMenuPermissionActions } from './hooks/useMenuPermissionActions'

const INITIAL_PERMISSION_FORM: PermissionFormData = {
  name: '',
  type: 1,
  parentId: 0,
  path: '',
  component: '',
  sortOrder: 0,
  isVisible: 1,
  permissionCode: '',
  status: 1,
}

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

export default function MenuManagement() {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<PermissionTreeNode | null>(null)
  const [permissionForm, setPermissionForm] = useState<PermissionFormData>(INITIAL_PERMISSION_FORM)

  const {
    permissionsQuery,
    createPermissionMutation,
    updatePermissionMutation,
    deletePermissionMutation,
  } = useMenuPermissionActions()

  const permissions = useMemo(() => permissionsQuery.data ?? [], [permissionsQuery.data])

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

  const permissionOptions = useMemo(() => {
    const options: { id: number; label: string }[] = []
    const traverse = (nodes: PermissionTreeNode[], depth: number) => {
      nodes.forEach((node) => {
        const prefix = depth > 0 ? `${'--'.repeat(depth)} ` : ''
        if (node.type !== 3) {
          options.push({ id: node.id, label: `${prefix}${node.name}` })
        }
        if (node.children && node.children.length > 0) {
          traverse(node.children, depth + 1)
        }
      })
    }
    traverse(permissions, 0)
    return options
  }, [permissions])

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

  const resetPermissionForm = () => {
    setPermissionForm(INITIAL_PERMISSION_FORM)
    setEditingPermission(null)
  }

  const openPermissionModal = (
    permission?: PermissionTreeNode | null,
    parent?: PermissionTreeNode,
  ) => {
    if (permission) {
      setEditingPermission(permission)
      setPermissionForm({
        name: permission.name,
        type: permission.type,
        parentId: permission.parentId,
        path: permission.path ?? '',
        component: permission.component ?? '',
        sortOrder: permission.sortOrder,
        isVisible: permission.isVisible,
        permissionCode: permission.permissionCode ?? '',
        status: permission.status,
      })
    } else {
      const defaultType = parent ? (parent.type === 1 ? 2 : parent.type === 2 ? 3 : 3) : 1
      setEditingPermission(null)
      setPermissionForm({
        ...INITIAL_PERMISSION_FORM,
        parentId: parent ? parent.id : 0,
        type: defaultType,
      })
    }
    setIsPermissionModalOpen(true)
  }

  const closePermissionModal = () => {
    setIsPermissionModalOpen(false)
    resetPermissionForm()
    createPermissionMutation.reset()
    updatePermissionMutation.reset()
  }

  const handlePermissionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = {
      name: permissionForm.name.trim(),
      type: permissionForm.type,
      parentId: permissionForm.parentId,
      path: permissionForm.path.trim() || undefined,
      component: permissionForm.component.trim() || undefined,
      sortOrder: permissionForm.sortOrder,
      isVisible: permissionForm.isVisible,
      permissionCode: permissionForm.permissionCode.trim() || undefined,
      status: permissionForm.status,
    }

    if (payload.type === 3) {
      payload.path = undefined
      payload.component = undefined
    }

    if (payload.type !== 3) {
      payload.permissionCode = undefined
    }

    if (payload.type === 1) {
      payload.component = undefined
    }

    const onSuccess = () => closePermissionModal()

    if (editingPermission) {
      updatePermissionMutation.mutate({ id: editingPermission.id, data: payload }, { onSuccess })
    } else {
      createPermissionMutation.mutate(payload, { onSuccess })
    }
  }

  const handleDeletePermission = (permission: PermissionTreeNode) => {
    if (permission.children && permission.children.length > 0) {
      return
    }
    const confirmed = window.confirm(`确定删除权限 “${permission.name}” 吗？`)
    if (!confirmed) {
      return
    }
    deletePermissionMutation.mutate(permission.id)
  }

  const loadError = permissionsQuery.error as Error | null
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-destructive gap-4">
        <AlertCircle className="w-12 h-12" />
        <p className="font-medium">加载失败: {loadError.message}</p>
        <Button variant="outline" onClick={() => permissionsQuery.refetch()}>
          重试
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">菜单管理</h2>
          <p className="text-muted-foreground mt-1 text-sm">管理菜单与按钮权限，维护系统导航树。</p>
        </div>
        <Button className="gap-2 shadow-sm" onClick={() => openPermissionModal()}>
          <Plus className="w-4 h-4" />
          新增权限
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">权限树维护</h3>
            <p className="text-sm text-muted-foreground">
              管理菜单、按钮等权限资源，禁用权限将无法被分配。
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExpandAll}>
              全部展开
            </Button>
            <Button variant="outline" size="sm" onClick={handleCollapseAll}>
              全部收起
            </Button>
          </div>
        </div>

        {permissionsQuery.isLoading ? (
          <div className="text-sm text-muted-foreground">权限加载中...</div>
        ) : null}

        {!permissionsQuery.isLoading && permissions.length === 0 ? (
          <div className="text-sm text-muted-foreground">暂无权限数据</div>
        ) : null}

        {permissions.length > 0 ? (
          <PermissionManageTree
            nodes={permissions}
            expandedIds={expandedIds}
            onToggleExpand={handleExpandToggle}
            onAddChild={(node) => openPermissionModal(null, node)}
            onEdit={(node) => openPermissionModal(node)}
            onDelete={handleDeletePermission}
          />
        ) : null}

        {deletePermissionMutation.error ? (
          <div className="text-sm text-destructive">
            删除失败: {(deletePermissionMutation.error as Error).message}
          </div>
        ) : null}
      </div>

      <PermissionFormModal
        isOpen={isPermissionModalOpen}
        title={editingPermission ? '编辑权限' : '新增权限'}
        formData={permissionForm}
        parentOptions={permissionOptions.map((option) => ({
          ...option,
          disabled: editingPermission ? option.id === editingPermission.id : false,
        }))}
        isPending={createPermissionMutation.isPending || updatePermissionMutation.isPending}
        error={(createPermissionMutation.error || updatePermissionMutation.error) as Error | null}
        onClose={closePermissionModal}
        onSubmit={handlePermissionSubmit}
        onChange={setPermissionForm}
      />
    </div>
  )
}
