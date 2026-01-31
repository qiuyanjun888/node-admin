import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Loader2, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { User, PageResult } from '@/types/system'

interface UserTableProps {
  data?: PageResult<User>
  isLoading: boolean
  isUpdating: boolean
  onEdit: (user: User) => void
  onToggleStatus: (user: User) => void
}

export function UserTable({ data, isLoading, isUpdating, onEdit, onToggleStatus }: UserTableProps) {
  if (isLoading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-muted-foreground font-medium">数据加载中...</span>
      </div>
    )
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground italic border rounded-xl bg-card">
        暂无用户数据
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30 transition-colors">
              <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">
                ID
              </th>
              <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">
                用户名
              </th>
              <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">
                昵称
              </th>
              <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">
                邮箱
              </th>
              <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">
                状态
              </th>
              <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.items.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-muted/30">
                <td
                  className={cn(
                    'px-6 py-4 align-middle font-mono transition-colors',
                    user.status === 1 ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {user.id}
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'font-medium transition-colors',
                        user.status === 1 ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {user.username}
                    </span>
                  </div>
                </td>
                <td
                  className={cn(
                    'px-6 py-4 align-middle transition-colors font-medium',
                    user.status === 1 ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {user.nickname || '-'}
                </td>
                <td
                  className={cn(
                    'px-6 py-4 align-middle transition-colors',
                    user.status === 1 ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {user.email || '-'}
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user.status === 1}
                      onCheckedChange={() => onToggleStatus(user)}
                      disabled={isUpdating}
                    />
                    <span
                      className={cn(
                        'text-xs font-medium',
                        user.status === 1 ? 'text-primary' : 'text-muted-foreground',
                      )}
                    >
                      {user.status === 1 ? '启用' : '禁用'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 align-middle text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => onEdit(user)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
