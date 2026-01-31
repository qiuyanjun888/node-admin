import { Test, TestingModule } from '@nestjs/testing'
import { RolesService } from '@/system/roles/roles.service'
import { PrismaService } from '@/prisma.service'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { CreateRoleDto } from '@/system/roles/dto/create-role.dto'
import { QueryRoleDto } from '@/system/roles/dto/query-role.dto'
import { UpdateRoleDto } from '@/system/roles/dto/update-role.dto'

const mockPrismaService = {
  role: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
}

describe('RolesService', () => {
  let service: RolesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<RolesService>(RolesService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    const createRoleDto: CreateRoleDto = {
      roleName: 'Admin',
      roleCode: 'admin',
      description: 'Administrator',
    }

    it('should create a new role successfully', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(null)
      mockPrismaService.role.create.mockResolvedValue({
        id: 1,
        ...createRoleDto,
        status: 1,
      })

      const result = await service.create(createRoleDto)

      expect(mockPrismaService.role.findUnique).toHaveBeenCalledWith({
        where: { roleCode: createRoleDto.roleCode },
      })
      expect(mockPrismaService.role.create).toHaveBeenCalled()
      expect(result).toBeDefined()
    })

    it('should throw ConflictException if roleCode already exists', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue({ id: 1, roleCode: 'admin' })

      await expect(service.create(createRoleDto)).rejects.toThrow(ConflictException)
    })
  })

  describe('findPage', () => {
    const query: QueryRoleDto = { page: 1, pageSize: 10 }

    it('should return paginated roles', async () => {
      mockPrismaService.role.count.mockResolvedValue(1)
      mockPrismaService.role.findMany.mockResolvedValue([{ id: 1, roleCode: 'admin' }])

      const result = await service.findPage(query)

      expect(result.items).toHaveLength(1)
      expect(result.total).toBe(1)
      expect(result.page).toBe(1)
    })
  })

  describe('findOne', () => {
    it('should return a role if found', async () => {
      const role = { id: 1, roleCode: 'admin' }
      mockPrismaService.role.findUnique.mockResolvedValue(role)

      const result = await service.findOne(1)

      expect(result).toEqual(role)
    })

    it('should throw NotFoundException if role not found', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(null)

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    const updateRoleDto: UpdateRoleDto = { roleName: 'Super Admin' }

    it('should update a role successfully', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue({ id: 1, roleCode: 'admin' })
      mockPrismaService.role.update.mockResolvedValue({ id: 1, ...updateRoleDto })

      const result = await service.update(1, updateRoleDto)

      expect(result).toBeDefined()
      expect(mockPrismaService.role.update).toHaveBeenCalled()
    })

    it('should throw NotFoundException if role not found', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(null)

      await expect(service.update(1, updateRoleDto)).rejects.toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('should logically delete roles (disable status)', async () => {
      mockPrismaService.role.updateMany.mockResolvedValue({ count: 2 })

      const result = await service.remove([1, 2])

      expect(result.count).toBe(2)
      expect(mockPrismaService.role.updateMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2] } },
        data: { status: 0 },
      })
    })
  })
})
