import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { PageResult, Role } from '@/types/system'

const STORAGE_KEY = 'node-admin.current-role-id'

interface CurrentRoleContextValue {
  roles: Role[]
  currentRoleId: number | null
  currentRole: Role | null
  setCurrentRoleId: (roleId: number) => void
  isLoading: boolean
  error: Error | null
}

const CurrentRoleContext = createContext<CurrentRoleContextValue | null>(null)

export function CurrentRoleProvider({ children }: { children: ReactNode }) {
  const rolesQuery = useQuery<PageResult<Role>>({
    queryKey: ['system', 'roles', 'all'],
    queryFn: () => api.get('/system/roles', { params: { page: 1, pageSize: 200, status: 1 } }),
  })

  const roles = rolesQuery.data?.items ?? []
  const [currentRoleId, setCurrentRoleId] = useState<number | null>(() => {
    if (typeof window === 'undefined') {
      return null
    }
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return null
    }
    const parsed = Number(stored)
    return Number.isNaN(parsed) ? null : parsed
  })

  useEffect(() => {
    if (roles.length === 0) {
      return
    }
    if (currentRoleId === null || !roles.some((role) => role.id === currentRoleId)) {
      setCurrentRoleId(roles[0].id)
    }
  }, [roles, currentRoleId])

  useEffect(() => {
    if (currentRoleId === null || typeof window === 'undefined') {
      return
    }
    window.localStorage.setItem(STORAGE_KEY, String(currentRoleId))
  }, [currentRoleId])

  const currentRole = roles.find((role) => role.id === currentRoleId) ?? null

  const value = useMemo(
    () => ({
      roles,
      currentRoleId,
      currentRole,
      setCurrentRoleId,
      isLoading: rolesQuery.isLoading,
      error: (rolesQuery.error as Error) ?? null,
    }),
    [roles, currentRoleId, currentRole, rolesQuery.isLoading, rolesQuery.error],
  )

  return <CurrentRoleContext.Provider value={value}>{children}</CurrentRoleContext.Provider>
}

export function useCurrentRole() {
  const context = useContext(CurrentRoleContext)
  if (!context) {
    throw new Error('useCurrentRole must be used within a CurrentRoleProvider')
  }
  return context
}
