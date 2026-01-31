import { http, HttpResponse } from 'msw'
import type { Role } from '@/types/system'

export const roleHandlers = [
  // Get roles
  http.get('*/system/roles', () => {
    return HttpResponse.json({
      success: true,
      code: 200,
      message: 'success',
      data: {
        items: [
          {
            id: 1,
            roleName: '超级管理员',
            roleCode: 'super_admin',
            description: '拥有所有权限',
            status: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 2,
            roleName: '普通用户',
            roleCode: 'common_user',
            description: '仅有基础权限',
            status: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        total: 2,
        page: 1,
        pageSize: 10,
      },
    })
  }),

  // Create role
  http.post('*/system/roles', async ({ request }) => {
    const newRole = (await request.json()) as Partial<Role>
    return HttpResponse.json({
      success: true,
      code: 200,
      message: 'success',
      data: {
        id: 3,
        ...newRole,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
  }),

  // Update role
  http.patch('*/system/roles/:id', async ({ params, request }) => {
    const updates = (await request.json()) as Partial<Role>
    return HttpResponse.json({
      success: true,
      code: 200,
      message: 'success',
      data: {
        id: Number(params.id),
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    })
  }),
]
