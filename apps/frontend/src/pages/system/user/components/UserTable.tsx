import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Loader2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { User, PageResult } from '@/types/system'

interface UserTableProps {
  data?: PageResult<User>
  isLoading: boolean
  isUpdating: boolean
  onEdit: (user: User) => void
  onToggleStatus: (user: User) => void
  canEdit: boolean
  canToggleStatus: boolean
  isPermissionReady: boolean
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function UserTable({
  data,
  isLoading,
  isUpdating,
  onEdit,
  onToggleStatus,
  canEdit,
  canToggleStatus,
  isPermissionReady,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: UserTableProps) {
  if (isLoading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-muted-foreground font-medium">数据加载中...</span>
      </div>
    )
  }

  const total = data?.total || 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  if (!data || data.items.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-64 flex items-center justify-center text-muted-foreground italic border rounded-xl bg-card">
          暂无用户数据
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
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
                      disabled={isUpdating || !isPermissionReady || !canToggleStatus}
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
                    {!isPermissionReady || canEdit ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => onEdit(user)}
                        disabled={!isPermissionReady || !canEdit}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      <div className="px-6 py-4 border-t flex items-center justify-between bg-muted/10">
        <div className="text-sm text-muted-foreground">
          共 <span className="font-medium text-foreground">{total}</span> 条记录， 每页
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value))
              onPageChange(1)
            }}
            className="mx-2 bg-transparent border-none focus:ring-0 cursor-pointer font-medium text-foreground underline decoration-dotted"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          条
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center gap-1 mx-2 text-sm font-medium">
              第 <span className="text-foreground">{page}</span> / {totalPages} 页
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(totalPages)}
              disabled={page === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
