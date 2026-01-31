import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { QueryRoleDto } from './dto/query-role.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

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
        orderBy: { createdAt: 'desc' },
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
    const role = await this.prisma.role.findUnique({
      where: { id },
    })

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`)
    }

    return role
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({ where: { id } })
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`)
    }

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
}
