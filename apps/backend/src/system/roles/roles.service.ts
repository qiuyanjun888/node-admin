import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { QueryRoleDto } from './dto/query-role.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  private async assertRoleExists(id: number) {
    const role = await this.prisma.role.findUnique({ where: { id } })
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`)
    }
    return role
  }

  async create(createRoleDto: CreateRoleDto) {
    const { roleCode } = createRoleDto

    const existingRole = await this.prisma.role.findUnique({
      where: { roleCode },
    })

    if (existingRole) {
      throw new ConflictException('Role code already exists')
    }

    return this.prisma.role.create({
      data: createRoleDto,
    })
  }

  async findPage(query: QueryRoleDto) {
    const { page, pageSize, roleName, roleCode, status } = query
    const skip = (page - 1) * pageSize

    const where: Prisma.RoleWhereInput = {}
    if (roleName) {
      where.roleName = { contains: roleName, mode: 'insensitive' }
    }
    if (roleCode) {
      where.roleCode = { contains: roleCode, mode: 'insensitive' }
    }
    if (status !== undefined) {
      where.status = status
    }

    const [total, items] = await Promise.all([
      this.prisma.role.count({ where }),
      this.prisma.role.findMany({
        where,
        skip,
        take: pageSize,
      }),
    ])

    return {
      items,
      total,
      page,
      pageSize,
    }
  }

  async findOne(id: number) {
    return this.assertRoleExists(id)
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.assertRoleExists(id)

    if (updateRoleDto.roleCode && updateRoleDto.roleCode !== role.roleCode) {
      const existingRole = await this.prisma.role.findUnique({
        where: { roleCode: updateRoleDto.roleCode },
      })
      if (existingRole) {
        throw new ConflictException('Role code already exists')
      }
    }

    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    })
  }

  /**
   * 按用户要求，删除操作改为更新状态（禁用）
   */
  async remove(ids: number[]) {
    return this.prisma.role.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        status: 0, // 0 表示禁用/无效
      },
    })
  }

  async getPermissions(roleId: number) {
    await this.assertRoleExists(roleId)

    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { roleId },
      select: { permissionId: true },
    })

    return rolePermissions.map((item) => item.permissionId)
  }

  async updatePermissions(roleId: number, permissionIds: number[]) {
    await this.assertRoleExists(roleId)

    const uniqueIds = Array.from(new Set(permissionIds))

    if (uniqueIds.length > 0) {
      const existingPermissions = await this.prisma.permission.findMany({
        where: { id: { in: uniqueIds } },
        select: { id: true },
      })

      if (existingPermissions.length !== uniqueIds.length) {
        const existingSet = new Set(existingPermissions.map((permission) => permission.id))
        const missingIds = uniqueIds.filter((id) => !existingSet.has(id))
        throw new NotFoundException(`Permission IDs not found: ${missingIds.join(', ')}`)
      }
    }

    const operations: Prisma.PrismaPromise<unknown>[] = [
      this.prisma.rolePermission.deleteMany({ where: { roleId } }),
    ]

    if (uniqueIds.length > 0) {
      operations.push(
        this.prisma.rolePermission.createMany({
          data: uniqueIds.map((permissionId) => ({ roleId, permissionId })),
        }),
      )
    }

    await this.prisma.$transaction(operations)

    return {
      roleId,
      permissionIds: uniqueIds,
    }
  }
}
