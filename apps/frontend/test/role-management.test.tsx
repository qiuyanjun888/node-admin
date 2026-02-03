import { render, screen, waitFor } from './test-utils'
import RoleManagement from '../src/pages/system/role'
import { describe, it, expect } from 'vitest'

describe('RoleManagement', () => {
  it('should render the role management page and headers', async () => {
    render(<RoleManagement />)

    expect(screen.getByText('角色管理')).toBeInTheDocument()
    //expect(screen.getByText('管理系统角色及其关联的权限。')).toBeInTheDocument()
    expect(screen.getByText('新增角色')).toBeInTheDocument()
  })

  it('should display roles from the mock API', async () => {
    render(<RoleManagement />)

    // Wait for the data to be loaded (mock server returns data)
    await waitFor(() => {
      expect(screen.getByText('超级管理员')).toBeInTheDocument()
      expect(screen.getByText('普通用户')).toBeInTheDocument()
    })

    expect(screen.getByText('super_admin')).toBeInTheDocument()
    expect(screen.getByText('拥有所有权限')).toBeInTheDocument()
    expect(screen.getByText('common_user')).toBeInTheDocument()
  })
})
