import {
  ChevronDown,
  ChevronRight,
  Folder,
  LayoutGrid,
  Plus,
  SquareMousePointer,
  Trash2,
  Pencil,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PermissionTreeNode } from '@/types/system'

const typeIcon: Record<number, typeof Folder> = {
  1: Folder,
  2: LayoutGrid,
  3: SquareMousePointer,
}

interface PermissionManageTreeProps {
  nodes: PermissionTreeNode[]
  expandedIds: Set<number>
  onToggleExpand: (id: number) => void
  onAddChild: (node: PermissionTreeNode) => void
  onEdit: (node: PermissionTreeNode) => void
  onDelete: (node: PermissionTreeNode) => void
}

function PermissionManageNode({
  node,
  level,
  expandedIds,
  onToggleExpand,
  onAddChild,
  onEdit,
  onDelete,
}: {
  node: PermissionTreeNode
  level: number
  expandedIds: Set<number>
  onToggleExpand: (id: number) => void
  onAddChild: (node: PermissionTreeNode) => void
  onEdit: (node: PermissionTreeNode) => void
  onDelete: (node: PermissionTreeNode) => void
}) {
  const hasChildren = !!node.children && node.children.length > 0
  const isExpanded = expandedIds.has(node.id)
  const Icon = typeIcon[node.type] ?? typeIcon[2]

  return (
    <div>
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-2 rounded-md px-2 py-2 transition-colors',
          node.status === 0 ? 'opacity-50' : 'hover:bg-muted/40',
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => hasChildren && onToggleExpand(node.id)}
            className={cn(
              'h-6 w-6 flex items-center justify-center rounded',
              hasChildren ? 'text-muted-foreground hover:text-foreground' : 'invisible',
            )}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : null}
          </button>
          <span className="inline-flex items-center gap-2 text-sm font-medium">
            <Icon className="h-4 w-4 text-muted-foreground" />
            {node.name}
          </span>

          {node.permissionCode ? (
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
              {node.permissionCode}
            </span>
          ) : null}
          {node.path ? <span className="text-xs text-muted-foreground">{node.path}</span> : null}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onAddChild(node)}
            disabled={node.type === 3}
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground transition-colors',
              node.type === 3
                ? 'cursor-not-allowed opacity-50'
                : 'hover:text-primary hover:border-primary/40',
            )}
            title={node.type === 3 ? '按钮权限不能再添加子级' : '新增子权限'}
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(node)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground hover:text-primary hover:border-primary/40"
            title="编辑权限"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(node)}
            disabled={hasChildren}
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground transition-colors',
              hasChildren
                ? 'cursor-not-allowed opacity-50'
                : 'hover:text-destructive hover:border-destructive/40',
            )}
            title={hasChildren ? '请先删除子权限' : '删除权限'}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {hasChildren && isExpanded ? (
        <div className="space-y-1">
          {node.children?.map((child) => (
            <PermissionManageNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function PermissionManageTree({
  nodes,
  expandedIds,
  onToggleExpand,
  onAddChild,
  onEdit,
  onDelete,
}: PermissionManageTreeProps) {
  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <PermissionManageNode
          key={node.id}
          node={node}
          level={0}
          expandedIds={expandedIds}
          onToggleExpand={onToggleExpand}
          onAddChild={onAddChild}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
