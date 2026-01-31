import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { User, PageResult } from '@/types/system'

export function useUserActions(
  page: number = 1,
  pageSize: number = 10,
  filters?: { username?: string; status?: number },
) {
  const queryClient = useQueryClient()

  // Fetch users
  const usersQuery = useQuery<PageResult<User>>({
    queryKey: ['system', 'users', page, pageSize, filters],
    queryFn: () => api.get('/system/users', { params: { page, pageSize, ...filters } }),
  })

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: (userData: Partial<User> & { password?: string }) =>
      api.post('/system/users', userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system', 'users'] })
    },
  })

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      api.patch(`/system/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system', 'users'] })
    },
  })

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === 1 ? 0 : 1
    return updateMutation.mutateAsync({
      id: user.id,
      data: { status: newStatus },
    })
  }

  return {
    usersQuery,
    createMutation,
    updateMutation,
    handleToggleStatus,
  }
}
