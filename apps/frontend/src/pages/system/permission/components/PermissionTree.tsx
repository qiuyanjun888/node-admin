import { useEffect, useMemo, useRef } from 'react'
import { ChevronDown, ChevronRight, Folder, LayoutGrid, SquareMousePointer } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PermissionTreeNode } from '@/types/system'

interface PermissionTreeProps {
  nodes: PermissionTreeNode[]
  selectedIds: Set<number>
  expandedIds: Set<number>
  onToggle: (node: PermissionTreeNode, checked: boolean) => void
  onToggleExpand: (id: number) => void
}

interface NodeState {
  checked: boolean
  indeterminate: boolean
}

function getNodeState(node: PermissionTreeNode, selectedIds: Set<number>): NodeState {
  if (!node.children || node.children.length === 0) {
    return { checked: selectedIds.has(node.id), indeterminate: false }
  }

  const childStates = node.children.map((child) => getNodeState(child, selectedIds))
  const allChecked = childStates.every((state) => state.checked && !state.indeterminate)
  const someChecked = childStates.some((state) => state.checked || state.indeterminate)

  return {
    checked: selectedIds.has(node.id),
    indeterminate: !allChecked && someChecked,
  }
}

const typeMeta: Record<number, { label: string; icon: typeof Folder; className: string }> = {
  1: { label: '目录', icon: Folder, className: 'bg-blue-50 text-blue-600 border-blue-200' },
  2: { label: '菜单', icon: LayoutGrid, className: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  3: {
    label: '按钮',
    icon: SquareMousePointer,
    className: 'bg-amber-50 text-amber-600 border-amber-200',
  },
}

function PermissionNode({
  node,
  level,
  selectedIds,
  expandedIds,
  onToggle,
  onToggleExpand,
}: {
  node: PermissionTreeNode
  level: number
  selectedIds: Set<number>
  expandedIds: Set<number>
  onToggle: (node: PermissionTreeNode, checked: boolean) => void
  onToggleExpand: (id: number) => void
}) {
  const checkboxRef = useRef<HTMLInputElement>(null)
  const state = useMemo(() => getNodeState(node, selectedIds), [node, selectedIds])
  const hasChildren = !!node.children && node.children.length > 0
  const isExpanded = expandedIds.has(node.id)
  const meta = typeMeta[node.type] ?? typeMeta[2]
  const Icon = meta.icon

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = state.indeterminate
    }
  }, [state.indeterminate])

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-2 transition-colors',
          node.status === 0 ? 'opacity-50' : 'hover:bg-muted/40',
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <button
          type="button"
          onClick={() => hasChildren && onToggleExpand(node.id)}
          className={cn(
            'h-6 w-6 flex items-center justify-center rounded',
            hasChildren ? 'text-muted-foreground hover:text-foreground' : 'invisible',
          )}
          aria-label={hasChildren ? (isExpanded ? 'Collapse' : 'Expand') : undefined}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : null}
        </button>
        <input
          ref={checkboxRef}
          type="checkbox"
          className="h-4 w-4 rounded border-muted-foreground/40"
          checked={state.checked}
          disabled={node.status === 0}
          onChange={(event) => onToggle(node, event.target.checked)}
        />
        <span className={cn('inline-flex items-center gap-2 text-sm font-medium')}>
          <Icon className="h-4 w-4 text-muted-foreground" />
          {node.name}
        </span>
        <span
          className={cn(
            'ml-2 rounded-full border px-2 py-0.5 text-xs font-medium',
            meta.className,
          )}
        >
          {meta.label}
        </span>
        {node.permissionCode ? (
          <span className="ml-2 rounded-md bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
            {node.permissionCode}
          </span>
        ) : null}
        {node.path ? (
          <span className="ml-2 text-xs text-muted-foreground">{node.path}</span>
        ) : null}
      </div>
      {hasChildren && isExpanded ? (
        <div className="space-y-1">
          {node.children?.map((child) => (
            <PermissionNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function PermissionTree({
  nodes,
  selectedIds,
  expandedIds,
  onToggle,
  onToggleExpand,
}: PermissionTreeProps) {
  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <PermissionNode
          key={node.id}
          node={node}
          level={0}
          selectedIds={selectedIds}
          expandedIds={expandedIds}
          onToggle={onToggle}
          onToggleExpand={onToggleExpand}
        />
      ))}
    </div>
  )
}
