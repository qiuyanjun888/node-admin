import { ListChecks, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PermissionTreeNode } from '@/types/system'
import { PermissionTree } from './PermissionTree'

interface PermissionAssignmentPanelProps {
  permissions: PermissionTreeNode[]
  selectedRoleId: number | null
  selectedRoleName?: string
  selectedIdCount: number
  totalPermissionCount: number
  selectedIds: Set<number>
  expandedIds: Set<number>
  isDirty: boolean
  isPermissionsLoading: boolean
  isRolePermissionsFetching: boolean
  onExpandAll: () => void
  onCollapseAll: () => void
  onSelectAll: () => void
  onClearAll: () => void
  onReset: () => void
  onToggleExpand: (id: number) => void
  onTogglePermission: (node: PermissionTreeNode, checked: boolean) => void
  saveError?: Error | null
  saveSuccess?: boolean
}

export function PermissionAssignmentPanel({
  permissions,
  selectedRoleId,
  selectedRoleName,
  selectedIdCount,
  totalPermissionCount,
  selectedIds,
  expandedIds,
  isDirty,
  isPermissionsLoading,
  isRolePermissionsFetching,
  onExpandAll,
  onCollapseAll,
  onSelectAll,
  onClearAll,
  onReset,
  onToggleExpand,
  onTogglePermission,
  saveError,
  saveSuccess,
}: PermissionAssignmentPanelProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold">权限树</h3>
          <span className="text-xs text-muted-foreground">
            已选 {selectedIdCount} / {totalPermissionCount}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={onExpandAll}>
            全部展开
          </Button>
          <Button variant="outline" size="sm" onClick={onCollapseAll}>
            全部收起
          </Button>
          <Button variant="outline" size="sm" onClick={onSelectAll}>
            全选
          </Button>
          <Button variant="outline" size="sm" onClick={onClearAll}>
            清空
          </Button>
          <Button variant="outline" size="sm" onClick={onReset} disabled={!isDirty}>
            <RefreshCcw className="w-4 h-4" />
            重置
          </Button>
        </div>
      </div>

      {selectedRoleId ? (
        <div className="rounded-lg border bg-background/50 p-3">
          <div className="text-xs text-muted-foreground">当前角色: {selectedRoleName}</div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          请选择左侧角色后分配权限
        </div>
      )}

      {isPermissionsLoading ? (
        <div className="text-sm text-muted-foreground">权限加载中...</div>
      ) : null}

      {selectedRoleId && isRolePermissionsFetching ? (
        <div className="text-sm text-muted-foreground">正在加载角色权限...</div>
      ) : null}

      {!isPermissionsLoading && permissions.length === 0 ? (
        <div className="text-sm text-muted-foreground">暂无权限数据</div>
      ) : null}

      {permissions.length > 0 ? (
        <PermissionTree
          nodes={permissions}
          selectedIds={selectedIds}
          expandedIds={expandedIds}
          onToggle={onTogglePermission}
          onToggleExpand={onToggleExpand}
        />
      ) : null}

      {saveError ? (
        <div className="text-sm text-destructive">保存失败: {saveError.message}</div>
      ) : null}

      {saveSuccess ? <div className="text-sm text-emerald-600">权限已保存</div> : null}
    </div>
  )
}
