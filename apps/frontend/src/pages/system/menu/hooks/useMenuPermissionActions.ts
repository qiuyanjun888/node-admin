import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Permission, PermissionTreeNode } from '@/types/system'

export function useMenuPermissionActions() {
  const queryClient = useQueryClient()

  const invalidatePermissionQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['system', 'permissions', 'tree'] })
    queryClient.invalidateQueries({ queryKey: ['system', 'permissions', 'menus'] })
  }

  const permissionsQuery = useQuery<PermissionTreeNode[]>({
    queryKey: ['system', 'permissions', 'tree'],
    queryFn: () => api.get('/system/permissions/tree'),
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
    permissionsQuery,
    createPermissionMutation,
    updatePermissionMutation,
    deletePermissionMutation,
  }
}
