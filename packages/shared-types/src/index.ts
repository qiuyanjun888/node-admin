export interface User {
  id: number
  username: string
  nickname?: string
  email?: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: number
  roleName: string
  roleCode: string
  description?: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface PageResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
