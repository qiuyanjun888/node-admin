import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Permission } from '@/types/system'
import { useCurrentRole } from '@/contexts/CurrentRoleContext'

export function usePermissionAccess() {
  const { currentRoleId } = useCurrentRole()

  const permissionsQuery = useQuery<Permission[]>({
    queryKey: ['system', 'permissions', 'all'],
    queryFn: () => api.get('/system/permissions'),
  })

  const rolePermissionsQuery = useQuery<number[]>({
    queryKey: ['system', 'roles', currentRoleId, 'permissions'],
    queryFn: () => api.get(`/system/roles/${currentRoleId}/permissions`),
    enabled: !!currentRoleId,
  })

  const permissionCodeSet = useMemo(() => {
    if (!permissionsQuery.data || !rolePermissionsQuery.data) {
      return new Set<string>()
    }
    const allowedIds = new Set(rolePermissionsQuery.data)
    const codes = new Set<string>()
    permissionsQuery.data.forEach((permission) => {
      if (permission.status !== 1) {
        return
      }
      if (allowedIds.has(permission.id) && permission.permissionCode) {
        codes.add(permission.permissionCode)
      }
    })
    return codes
  }, [permissionsQuery.data, rolePermissionsQuery.data])

  const isReady =
    !permissionsQuery.isLoading &&
    !!currentRoleId &&
    !rolePermissionsQuery.isLoading &&
    !rolePermissionsQuery.isFetching

  const hasPermission = useCallback(
    (code: string) => {
      if (!isReady) {
        return false
      }
      return permissionCodeSet.has(code)
    },
    [isReady, permissionCodeSet],
  )

  return {
    hasPermission,
    isReady,
    isLoading: permissionsQuery.isLoading || rolePermissionsQuery.isLoading,
  }
}
