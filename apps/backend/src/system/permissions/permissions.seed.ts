import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'

@Injectable()
export class PermissionsSeedService implements OnModuleInit {
  private readonly logger = new Logger(PermissionsSeedService.name)

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const permissionIds = await this.ensureDefaultPermissions()
    const adminRole = await this.ensureAdminRole()

    if (adminRole && permissionIds.length > 0) {
      await this.prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId: adminRole.id,
          permissionId,
        })),
        skipDuplicates: true,
      })
    }

    if (permissionIds.length > 0) {
      this.logger.log(`Ensured ${permissionIds.length} default permissions`)
    }
  }

  private async ensureAdminRole() {
    const existing = await this.prisma.role.findFirst({
      where: { roleCode: 'SUPER_ADMIN' },
    })
    if (existing) {
      return existing
    }
    return this.prisma.role.create({
      data: {
        roleName: '超级管理员',
        roleCode: 'SUPER_ADMIN',
        description: '拥有所有权限',
      },
    })
  }

  private async ensureDefaultPermissions(): Promise<number[]> {
    const createdIds: number[] = []

    const dashboard = await this.upsertPermission(
      {
        name: '控制台',
        type: 2,
        parentId: 0,
        path: '/',
        component: 'dashboard/index',
        sortOrder: 0,
        isVisible: 1,
        status: 1,
      },
      { type: 2, path: '/' },
    )
    createdIds.push(dashboard.id)

    const systemDirectory = await this.upsertPermission(
      {
        name: '系统管理',
        type: 1,
        parentId: 0,
        path: '/system',
        sortOrder: 1,
        isVisible: 1,
        status: 1,
      },
      { type: 1, path: '/system' },
    )
    createdIds.push(systemDirectory.id)

    const menuManagement = await this.upsertPermission(
      {
        name: '菜单管理',
        type: 2,
        parentId: systemDirectory.id,
        path: '/system/menu',
        component: 'system/menu/index',
        sortOrder: 1,
        isVisible: 1,
        status: 1,
      },
      { type: 2, path: '/system/menu' },
    )
    createdIds.push(menuManagement.id)

    const roleManagement = await this.upsertPermission(
      {
        name: '角色管理',
        type: 2,
        parentId: systemDirectory.id,
        path: '/system/role',
        component: 'system/role/index',
        sortOrder: 2,
        isVisible: 1,
        status: 1,
      },
      { type: 2, path: '/system/role' },
    )
    createdIds.push(roleManagement.id)

    const userManagement = await this.upsertPermission(
      {
        name: '用户管理',
        type: 2,
        parentId: systemDirectory.id,
        path: '/system/user',
        component: 'system/user/index',
        sortOrder: 3,
        isVisible: 1,
        status: 1,
      },
      { type: 2, path: '/system/user' },
    )
    createdIds.push(userManagement.id)

    const permissionManagement = await this.upsertPermission(
      {
        name: '权限管理',
        type: 2,
        parentId: systemDirectory.id,
        path: '/system/permission',
        component: 'system/permission/index',
        sortOrder: 4,
        isVisible: 1,
        status: 1,
      },
      { type: 2, path: '/system/permission' },
    )
    createdIds.push(permissionManagement.id)

    const actions = [
      { name: '新增菜单', parentId: menuManagement.id, permissionCode: 'sys:menu:add' },
      { name: '编辑菜单', parentId: menuManagement.id, permissionCode: 'sys:menu:edit' },
      { name: '删除菜单', parentId: menuManagement.id, permissionCode: 'sys:menu:delete' },
      { name: '新增角色', parentId: roleManagement.id, permissionCode: 'sys:role:add' },
      { name: '编辑角色', parentId: roleManagement.id, permissionCode: 'sys:role:edit' },
      { name: '禁用角色', parentId: roleManagement.id, permissionCode: 'sys:role:disable' },
      { name: '新增用户', parentId: userManagement.id, permissionCode: 'sys:user:add' },
      { name: '编辑用户', parentId: userManagement.id, permissionCode: 'sys:user:edit' },
      { name: '禁用用户', parentId: userManagement.id, permissionCode: 'sys:user:disable' },
      { name: '新增权限', parentId: permissionManagement.id, permissionCode: 'sys:permission:add' },
      { name: '编辑权限', parentId: permissionManagement.id, permissionCode: 'sys:permission:edit' },
      { name: '删除权限', parentId: permissionManagement.id, permissionCode: 'sys:permission:delete' },
      { name: '角色授权', parentId: permissionManagement.id, permissionCode: 'sys:permission:assign' },
    ]

    for (const action of actions) {
      const created = await this.upsertPermission(
        {
          name: action.name,
          type: 3,
          parentId: action.parentId,
          permissionCode: action.permissionCode,
          isVisible: 1,
          status: 1,
        },
        { type: 3, permissionCode: action.permissionCode },
      )
      createdIds.push(created.id)
    }

    return Array.from(new Set(createdIds))
  }

  private async upsertPermission(
    data: {
      name: string
      type: number
      parentId: number
      path?: string
      component?: string
      sortOrder?: number
      isVisible?: number
      permissionCode?: string
      status?: number
    },
    unique: { type: number; path?: string; permissionCode?: string },
  ) {
    const existing = await this.prisma.permission.findFirst({
      where: {
        type: unique.type,
        ...(unique.path ? { path: unique.path } : {}),
        ...(unique.permissionCode ? { permissionCode: unique.permissionCode } : {}),
      },
    })
    if (existing) {
      return existing
    }
    return this.prisma.permission.create({ data })
  }
}
