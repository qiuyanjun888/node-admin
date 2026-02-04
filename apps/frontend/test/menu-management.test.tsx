import { render, screen, waitFor } from './test-utils'
import MenuManagement from '../src/pages/system/menu'
import { describe, it, expect } from 'vitest'

describe('MenuManagement', () => {
  it('should render the menu management page and headers', () => {
    render(<MenuManagement />)

    expect(screen.getByRole('heading', { name: '菜单管理' })).toBeInTheDocument()
    expect(screen.getByText('管理菜单与按钮权限，维护系统导航树。')).toBeInTheDocument()
    expect(screen.getByText('新增权限')).toBeInTheDocument()
  })

  it('should load permission tree data', async () => {
    render(<MenuManagement />)

    await waitFor(() => {
      expect(screen.getByText('系统管理')).toBeInTheDocument()
      expect(screen.getByText('用户管理')).toBeInTheDocument()
      expect(screen.getByText('新增用户')).toBeInTheDocument()
    })
  })
})
