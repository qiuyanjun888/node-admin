import { http, HttpResponse } from 'msw'
import type { User } from '@/types/system'

const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    nickname: '管理员',
    email: 'admin@example.com',
    status: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    username: 'test',
    nickname: '测试用户',
    email: 'test@example.com',
    status: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const handlers = [
  // Get users
  http.get('*/system/users', () => {
    return HttpResponse.json({
      success: true,
      code: 200,
      message: 'success',
      data: {
        items: mockUsers,
        total: mockUsers.length,
        page: 1,
        pageSize: 10,
      },
    })
  }),

  // Create user
  http.post('*/system/users', async ({ request }) => {
    const newUser = (await request.json()) as Partial<User>
    return HttpResponse.json({
      success: true,
      code: 200,
      message: 'success',
      data: {
        id: 3,
        ...newUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
  }),

  // Update user
  http.patch('*/system/users/:id', async ({ params, request }) => {
    const { id } = params
    const updates = (await request.json()) as Partial<User>
    const user = mockUsers.find((u) => u.id === Number(id))

    if (!user) {
      return HttpResponse.json(
        {
          success: false,
          code: 404,
          message: 'User not found',
          data: null,
        },
        { status: 404 },
      )
    }

    return HttpResponse.json({
      success: true,
      code: 200,
      message: 'success',
      data: {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    })
  }),
]
