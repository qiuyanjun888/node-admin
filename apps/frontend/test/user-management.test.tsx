import { render, screen, waitFor } from './test-utils'
import UserManagement from '../src/pages/system/user'
import { describe, it, expect } from 'vitest'

describe('UserManagement', () => {
  it('should render the user management page and headers', async () => {
    render(<UserManagement />)

    expect(screen.getByText('用户管理')).toBeInTheDocument()
    expect(screen.getByText('维护后台管理员账号及启用状态。')).toBeInTheDocument()
    expect(screen.getByText('新增用户')).toBeInTheDocument()
  })

  it('should display users from the mock API', async () => {
    render(<UserManagement />)

    // Wait for the data to be loaded (mock server returns data)
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
      expect(screen.getByText('测试用户')).toBeInTheDocument()
    })

    expect(screen.getByText('管理员')).toBeInTheDocument()
    expect(screen.getByText('admin@example.com')).toBeInTheDocument()
  })
})
