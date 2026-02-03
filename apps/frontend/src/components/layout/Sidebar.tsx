import { useState, createElement } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Settings,
  Users,
  Menu as MenuIcon,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { PermissionTreeNode } from '@/types/system'
import { useCurrentRole } from '@/contexts/CurrentRoleContext'

interface SidebarProps {
  isOpen: boolean
}

const iconMap: Record<string, LucideIcon> = {
  '/': LayoutDashboard,
  '/system': Settings,
  '/system/menu': MenuIcon,
  '/system/role': ShieldCheck,
  '/system/user': Users,
  '/system/permission': ShieldCheck,
}

function resolveIcon(node: PermissionTreeNode) {
  if (node.path && iconMap[node.path]) {
    return iconMap[node.path]
  }
  return node.type === 1 ? Settings : MenuIcon
}

function SidebarIcon({ node, className }: { node: PermissionTreeNode; className?: string }) {
  return createElement(resolveIcon(node), { className })
}

function SidebarNode({
  node,
  isSidebarOpen,
  depth = 0,
}: {
  node: PermissionTreeNode
  isSidebarOpen: boolean
  depth?: number
}) {
  const location = useLocation()
  const hasChildren = Boolean(node.children && node.children.length > 0)
  const isActive = Boolean(
    node.path && (location.pathname === node.path || location.pathname.startsWith(`${node.path}/`)),
  )
  const [isExpanded, setExpanded] = useState(hasChildren && isActive)

  // Synchronize expanded state when isActive changes
  const [prevIsActive, setPrevIsActive] = useState(isActive)
  if (isActive !== prevIsActive) {
    setPrevIsActive(isActive)
    if (isActive && hasChildren) {
      setExpanded(true)
    }
  }

  if (node.type === 1) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setExpanded(!isExpanded)}
          className={cn(
            'w-full flex items-center px-3 py-2 rounded-lg transition-colors group',
            'hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground font-medium',
          )}
          style={{ paddingLeft: isSidebarOpen ? 12 + depth * 12 : 12 }}
        >
          <SidebarIcon node={node} className="w-5 h-5 shrink-0 text-sidebar-primary/80" />
          {isSidebarOpen && (
            <>
              <span className="ml-3 flex-1 text-left">{node.name}</span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform opacity-50',
                  isExpanded && 'rotate-180',
                )}
              />
            </>
          )}
        </button>

        {isSidebarOpen && isExpanded && hasChildren && (
          <div className="ml-4 pl-4 border-l border-sidebar-border space-y-1 mt-1">
            {node.children?.map((child) => (
              <SidebarNode
                key={child.id}
                node={child}
                isSidebarOpen={isSidebarOpen}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (!node.path) {
    return null
  }

  return (
    <Link
      to={node.path}
      className={cn(
        'flex items-center px-3 py-2 rounded-lg text-sm transition-colors',
        isActive
          ? 'bg-sidebar-accent text-sidebar-foreground font-semibold'
          : 'text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
      )}
      style={{ paddingLeft: isSidebarOpen ? 12 + depth * 12 : 12 }}
    >
      <SidebarIcon node={node} className="w-4 h-4 shrink-0" />
      {isSidebarOpen && <span className="ml-3">{node.name}</span>}
    </Link>
  )
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const { currentRoleId } = useCurrentRole()

  const menuQuery = useQuery<PermissionTreeNode[]>({
    queryKey: ['system', 'permissions', 'menus', currentRoleId],
    queryFn: () =>
      api.get('/system/permissions/menus', {
        params: currentRoleId ? { roleId: currentRoleId } : {},
      }),
  })

  const menuTree = menuQuery.data ?? []

  return (
    <aside
      className={cn(
        'bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col',
        isOpen ? 'w-64' : 'w-20',
      )}
    >
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="bg-sidebar-primary w-8 h-8 rounded-lg flex items-center justify-center">
          <span className="text-sidebar-primary-foreground font-bold italic">NA</span>
        </div>
        {isOpen && (
          <span className="ml-3 font-bold text-xl tracking-tight text-sidebar-foreground">
            NodeAdmin
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
        {menuQuery.isLoading && isOpen && (
          <div className="px-3 py-2 text-sm text-sidebar-foreground/50">菜单加载中...</div>
        )}
        {menuQuery.error && isOpen && (
          <div className="px-3 py-2 text-sm text-red-500">
            菜单加载失败: {(menuQuery.error as Error).message}
          </div>
        )}
        {!menuQuery.isLoading && menuTree.length === 0 && isOpen && (
          <div className="px-3 py-2 text-sm text-sidebar-foreground/50">暂无可用菜单</div>
        )}
        {menuTree.map((node) => (
          <SidebarNode key={node.id} node={node} isSidebarOpen={isOpen} />
        ))}
      </nav>
    </aside>
  )
}
