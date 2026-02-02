import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import type { Permission } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { QueryPermissionDto } from './dto/query-permission.dto'

export interface PermissionNode extends Permission {
  children?: PermissionNode[]
}

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  private async assertPermissionExists(id: number) {
    const permission = await this.prisma.permission.findUnique({ where: { id } })
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`)
    }
    return permission
  }

  private async assertRoleExists(id: number) {
    const role = await this.prisma.role.findUnique({ where: { id } })
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`)
    }
    return role
  }

  async create(createPermissionDto: CreatePermissionDto) {
    const parentId = createPermissionDto.parentId ?? 0

    if (parentId !== 0) {
      await this.assertPermissionExists(parentId)
    }

    if (createPermissionDto.type === 3 && !createPermissionDto.permissionCode) {
      throw new ConflictException('Button permission requires permissionCode')
    }

    return this.prisma.permission.create({
      data: {
        ...createPermissionDto,
        parentId,
      },
    })
  }

  async findAll(query: QueryPermissionDto = {}) {
    const where: Prisma.PermissionWhereInput = {}

    if (query.name) {
      where.name = { contains: query.name, mode: 'insensitive' }
    }
    if (query.type !== undefined) {
      where.type = query.type
    }
    if (query.parentId !== undefined) {
      where.parentId = query.parentId
    }
    if (query.status !== undefined) {
      where.status = query.status
    }

    return this.prisma.permission.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    })
  }

  async findTree(): Promise<PermissionNode[]> {
    const permissions = await this.findAll()
    return buildPermissionTree(permissions)
  }

  async findMenuTree(roleId?: number): Promise<PermissionNode[]> {
    const permissions = await this.prisma.permission.findMany({
      where: {
        type: { in: [1, 2] },
        status: 1,
        isVisible: 1,
      },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    })

    const tree = buildPermissionTree(permissions)

    if (roleId === undefined) {
      return tree
    }

    await this.assertRoleExists(roleId)

    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { roleId },
      select: { permissionId: true },
    })

    const allowedIds = new Set(rolePermissions.map((item) => item.permissionId))
    return filterPermissionTree(tree, allowedIds)
  }

  async findOne(id: number) {
    return this.assertPermissionExists(id)
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.assertPermissionExists(id)

    if (updatePermissionDto.parentId !== undefined) {
      if (updatePermissionDto.parentId === id) {
        throw new ConflictException('Parent ID cannot be the same as permission ID')
      }
      if (updatePermissionDto.parentId !== 0) {
        await this.assertPermissionExists(updatePermissionDto.parentId)
      }
    }

    if (
      (updatePermissionDto.type ?? permission.type) === 3 &&
      !updatePermissionDto.permissionCode &&
      !permission.permissionCode
    ) {
      throw new ConflictException('Button permission requires permissionCode')
    }

    return this.prisma.permission.update({
      where: { id },
      data: updatePermissionDto,
    })
  }

  /**
   * 逻辑删除权限，并清理关联的角色权限
   */
  async remove(ids: number[]) {
    const operations: Prisma.PrismaPromise<unknown>[] = [
      this.prisma.rolePermission.deleteMany({ where: { permissionId: { in: ids } } }),
      this.prisma.permission.updateMany({
        where: { id: { in: ids } },
        data: { status: 0 },
      }),
    ]

    await this.prisma.$transaction(operations)

    return { count: ids.length }
  }
}

function buildPermissionTree(permissions: Permission[]): PermissionNode[] {
  const nodeMap = new Map<number, PermissionNode>()
  const roots: PermissionNode[] = []

  permissions.forEach((permission) => {
    nodeMap.set(permission.id, { ...permission, children: [] })
  })

  nodeMap.forEach((node) => {
    if (!node.parentId || node.parentId === 0) {
      roots.push(node)
      return
    }

    const parent = nodeMap.get(node.parentId)
    if (parent) {
      parent.children = parent.children ?? []
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  })

  const sortNodes = (nodes: PermissionNode[]) => {
    nodes.sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder
      }
      return a.id - b.id
    })
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortNodes(node.children)
      }
    })
  }

  sortNodes(roots)
  return roots
}

function filterPermissionTree(nodes: PermissionNode[], allowedIds: Set<number>): PermissionNode[] {
  const filtered: PermissionNode[] = []

  nodes.forEach((node) => {
    const children = node.children ? filterPermissionTree(node.children, allowedIds) : []
    if (allowedIds.has(node.id) || children.length > 0) {
      filtered.push({
        ...node,
        children,
      })
    }
  })

  return filtered
}
