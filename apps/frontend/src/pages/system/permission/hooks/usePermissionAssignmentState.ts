import { useEffect, useMemo, useRef, useState } from 'react'
import type { PermissionTreeNode, Role } from '@/types/system'
import {
  areSetsEqual,
  collectDescendantIds,
  flattenPermissions,
  normalizeSelection,
} from '../utils'

interface PermissionAssignmentStateParams {
  permissions: PermissionTreeNode[]
  roles: Role[]
  rolePermissions?: number[]
  selectedRoleId: number | null
  setSelectedRoleId: (id: number | null) => void
}

export function usePermissionAssignmentState({
  permissions,
  roles,
  rolePermissions,
  selectedRoleId,
  setSelectedRoleId,
}: PermissionAssignmentStateParams) {
  const [roleKeyword, setRoleKeyword] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [initialSelectedIds, setInitialSelectedIds] = useState<number[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const lastRolePermissionsRef = useRef<number[] | null>(null)

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

  useEffect(() => {
    if (permissions.length === 0) {
      return
    }
    const nodesWithChildren = flattenPermissions(permissions)
      .filter((node) => node.children && node.children.length > 0)
      .map((node) => node.id)
    setExpandedIds(new Set(nodesWithChildren))
  }, [permissions])

  useEffect(() => {
    if (roles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(roles[0].id)
    }
  }, [roles, selectedRoleId])

  useEffect(() => {
    if (!rolePermissions || rolePermissions === lastRolePermissionsRef.current) {
      return
    }
    lastRolePermissionsRef.current = rolePermissions
    const normalized = normalizeSelection(new Set(rolePermissions), parentMap)
    const nextIds = Array.from(normalized).sort((a, b) => a - b)
    setSelectedIds(nextIds)
    setInitialSelectedIds(nextIds)
  }, [rolePermissions, parentMap])

  const filteredRoles = useMemo(() => {
    if (!roleKeyword.trim()) {
      return roles
    }
    const keyword = roleKeyword.trim().toLowerCase()
    return roles.filter(
      (role) =>
        role.roleName.toLowerCase().includes(keyword) ||
        role.roleCode.toLowerCase().includes(keyword),
    )
  }, [roleKeyword, roles])

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

  return {
    selectedRoleId,
    setSelectedRoleId,
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
  }
}
