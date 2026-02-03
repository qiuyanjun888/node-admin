import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { QueryUserDto } from './dto/query-user.dto'
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'

const userSelect = {
  id: true,
  username: true,
  nickname: true,
  email: true,
  avatar: true,
  status: true,
  createdAt: true,
  updatedAt: true,
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password, ...rest } = createUserDto

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    })
    if (existingUser) {
      throw new ConflictException('Username already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    return this.prisma.user.create({
      data: {
        ...rest,
        username,
        password: hashedPassword,
      },
      select: userSelect,
    })
  }

  async findPage(query: QueryUserDto) {
    const { page, pageSize, username, status } = query
    const skip = (page - 1) * pageSize

    const where: Prisma.UserWhereInput = {}
    if (username) {
      where.username = { contains: username, mode: 'insensitive' }
    }
    if (status !== undefined) {
      where.status = status
    }

    const [total, items] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        select: userSelect,
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
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, username, ...rest } = updateUserDto

    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    if (username && username !== user.username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username },
      })
      if (existingUser) {
        throw new ConflictException('Username already exists')
      }
    }

    const updateData: Prisma.UserUpdateInput = { ...rest, username }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: userSelect,
    })
  }

  async remove(ids: number[]) {
    return this.prisma.user.deleteMany({
      where: {
        id: { in: ids },
      },
    })
  }
}
