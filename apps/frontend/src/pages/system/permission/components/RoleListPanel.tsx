import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Role } from '@/types/system'

interface RoleListPanelProps {
  roles: Role[]
  total: number
  selectedRoleId: number | null
  roleKeyword: string
  onRoleKeywordChange: (value: string) => void
  onSelectRole: (id: number) => void
  isLoading: boolean
}

export function RoleListPanel({
  roles,
  total,
  selectedRoleId,
  roleKeyword,
  onRoleKeywordChange,
  onSelectRole,
  isLoading,
}: RoleListPanelProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">角色列表</h3>
        <span className="text-xs text-muted-foreground">共 {total} 个</span>
      </div>
      <Input
        placeholder="搜索角色名称或编码"
        value={roleKeyword}
        onChange={(event) => onRoleKeywordChange(event.target.value)}
      />
      <div className="space-y-2 max-h-[480px] overflow-y-auto">
        {(isLoading ? [] : roles).map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => onSelectRole(role.id)}
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
        {isLoading ? <div className="text-sm text-muted-foreground">角色加载中...</div> : null}
        {!isLoading && roles.length === 0 ? (
          <div className="text-sm text-muted-foreground">暂无匹配角色</div>
        ) : null}
      </div>
    </div>
  )
}
