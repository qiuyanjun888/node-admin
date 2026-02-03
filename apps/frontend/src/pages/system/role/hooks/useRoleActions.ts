import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Role, PageResult } from '@/types/system'

export function useRoleActions(
  page: number = 1,
  pageSize: number = 10,
  filters?: { roleName?: string; roleCode?: string; status?: number },
) {
  const queryClient = useQueryClient()

  // Fetch roles
  const rolesQuery = useQuery<PageResult<Role>>({
    queryKey: ['system', 'roles', page, pageSize, filters],
    queryFn: () => api.get('/system/roles', { params: { page, pageSize, ...filters } }),
  })

  // Create role mutation
  const createMutation = useMutation({
    mutationFn: (roleData: Partial<Role>) => api.post('/system/roles', roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system', 'roles'] })
    },
  })

  // Update role mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Role> }): Promise<Role> =>
      api.patch(`/system/roles/${id}`, data),
    onSuccess: (updatedRole: Role) => {
      // Update the role in any cached lists (both the paginated one and the 'all' list)
      queryClient.setQueriesData<PageResult<Role>>({ queryKey: ['system', 'roles'] }, (oldData) => {
        if (!oldData || !oldData.items) return oldData
        return {
          ...oldData,
          items: oldData.items.map((role) =>
            role.id === updatedRole.id ? { ...role, ...updatedRole } : role,
          ),
        }
      })
    },
  })

  // Delete role mutation (Logic delete)
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/system/roles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system', 'roles'] })
    },
  })

  const handleToggleStatus = (role: Role) => {
    const newStatus = role.status === 1 ? 0 : 1
    return updateMutation.mutateAsync({
      id: role.id,
      data: { status: newStatus },
    })
  }

  return {
    rolesQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    handleToggleStatus,
  }
}
