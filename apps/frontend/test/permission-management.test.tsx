import { render, screen, waitFor } from './test-utils'
import PermissionManagement from '../src/pages/system/permission'
import { describe, it, expect } from 'vitest'

describe('PermissionManagement', () => {
  it('should render the permission management page and headers', () => {
    render(<PermissionManagement />)

    expect(screen.getByRole('heading', { name: '权限管理' })).toBeInTheDocument()
    expect(screen.getByText('按角色分配菜单与操作权限，并维护权限树配置。')).toBeInTheDocument()
    expect(screen.getByText('保存权限')).toBeInTheDocument()
  })

  it('should load roles and permission tree data', async () => {
    render(<PermissionManagement />)

    await waitFor(() => {
      expect(screen.getByText('超级管理员')).toBeInTheDocument()
      expect(screen.getByText('普通用户')).toBeInTheDocument()
      expect(screen.getByText('系统管理')).toBeInTheDocument()
      expect(screen.getByText('用户管理')).toBeInTheDocument()
      expect(screen.getByText('新增用户')).toBeInTheDocument()
    })
  })
})
