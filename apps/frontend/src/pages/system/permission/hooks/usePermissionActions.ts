import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { PageResult, Permission, PermissionTreeNode, Role } from '@/types/system'

const ROLE_PAGE_SIZE = 1000

export function usePermissionActions(roleId?: number) {
  const queryClient = useQueryClient()

  const invalidatePermissionQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['system', 'permissions', 'tree'] })
    queryClient.invalidateQueries({ queryKey: ['system', 'permissions', 'menus'] })
    if (roleId) {
      queryClient.invalidateQueries({ queryKey: ['system', 'roles', roleId, 'permissions'] })
    }
  }

  const rolesQuery = useQuery<PageResult<Role>>({
    queryKey: ['system', 'roles', 'all'],
    queryFn: () => api.get('/system/roles', { params: { page: 1, pageSize: ROLE_PAGE_SIZE } }),
  })

  const permissionsQuery = useQuery<PermissionTreeNode[]>({
    queryKey: ['system', 'permissions', 'tree'],
    queryFn: () => api.get('/system/permissions/tree'),
  })

  const rolePermissionsQuery = useQuery<number[]>({
    queryKey: ['system', 'roles', roleId, 'permissions'],
    queryFn: () => api.get(`/system/roles/${roleId}/permissions`),
    enabled: !!roleId,
  })

  const updateRolePermissionsMutation = useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: number; permissionIds: number[] }) =>
      api.put(`/system/roles/${roleId}/permissions`, { permissionIds }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['system', 'roles', variables.roleId, 'permissions'],
      })
      queryClient.invalidateQueries({
        queryKey: ['system', 'permissions', 'menus', variables.roleId],
      })
    },
  })

  const createPermissionMutation = useMutation({
    mutationFn: (data: Partial<Permission>) => api.post('/system/permissions', data),
    onSuccess: invalidatePermissionQueries,
  })

  const updatePermissionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Permission> }) =>
      api.patch(`/system/permissions/${id}`, data),
    onSuccess: invalidatePermissionQueries,
  })

  const deletePermissionMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/system/permissions/${id}`),
    onSuccess: invalidatePermissionQueries,
  })

  return {
    rolesQuery,
    permissionsQuery,
    rolePermissionsQuery,
    updateRolePermissionsMutation,
    createPermissionMutation,
    updatePermissionMutation,
    deletePermissionMutation,
  }
}
