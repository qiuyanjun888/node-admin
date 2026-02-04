import { useMemo, useState } from 'react'
import { AlertCircle, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PermissionAssignmentPanel } from './components/PermissionAssignmentPanel'
import { RoleListPanel } from './components/RoleListPanel'
import { usePermissionActions } from './hooks/usePermissionActions'
import { usePermissionAssignmentState } from './hooks/usePermissionAssignmentState'

export default function PermissionManagement() {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)

  const { rolesQuery, permissionsQuery, rolePermissionsQuery, updateRolePermissionsMutation } =
    usePermissionActions(selectedRoleId ?? undefined)

  const loadError = (rolesQuery.error ?? permissionsQuery.error) as Error | null
  const permissions = useMemo(() => permissionsQuery.data ?? [], [permissionsQuery.data])
  const roles = useMemo(() => rolesQuery.data?.items ?? [], [rolesQuery.data?.items])

  const {
    roleKeyword,
    setRoleKeyword,
    filteredRoles,
    selectedIds,
    selectedIdSet,
    expandedIds,
    allPermissionIds,
    isDirty,
    handleTogglePermission,
    handleExpandToggle,
    handleExpandAll,
    handleCollapseAll,
    handleSelectAll,
    handleClearAll,
    handleReset,
  } = usePermissionAssignmentState({
    permissions,
    roles,
    rolePermissions: rolePermissionsQuery.data,
    selectedRoleId,
    setSelectedRoleId,
  })

  const selectedRoleName = useMemo(() => {
    return roles.find((role) => role.id === selectedRoleId)?.roleName
  }, [roles, selectedRoleId])

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
        <RoleListPanel
          roles={filteredRoles}
          total={rolesQuery.data?.total ?? 0}
          selectedRoleId={selectedRoleId}
          roleKeyword={roleKeyword}
          onRoleKeywordChange={setRoleKeyword}
          onSelectRole={(id) => setSelectedRoleId(id)}
          isLoading={rolesQuery.isLoading}
        />

        <PermissionAssignmentPanel
          permissions={permissions}
          selectedRoleId={selectedRoleId}
          selectedRoleName={selectedRoleName}
          selectedIdCount={selectedIdSet.size}
          totalPermissionCount={allPermissionIds.length}
          selectedIds={selectedIdSet}
          expandedIds={expandedIds}
          isDirty={isDirty}
          isPermissionsLoading={permissionsQuery.isLoading}
          isRolePermissionsFetching={rolePermissionsQuery.isFetching}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
          onReset={handleReset}
          onToggleExpand={handleExpandToggle}
          onTogglePermission={handleTogglePermission}
          saveError={updateRolePermissionsMutation.error as Error | null}
          saveSuccess={updateRolePermissionsMutation.isSuccess}
        />
      </div>
    </div>
  )
}
