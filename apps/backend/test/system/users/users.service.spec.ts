import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from '@/system/users/users.service'
import { PrismaService } from '@/prisma.service'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from '@/system/users/dto/create-user.dto'
import { QueryUserDto } from '@/system/users/dto/query-user.dto'
import { UpdateUserDto } from '@/system/users/dto/update-user.dto'

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn(),
  },
}

describe('UsersService', () => {
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      password: 'password123',
      nickname: 'Test Nickname',
      email: 'test@example.com',
    }

    it('should create a new user successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)
      mockPrismaService.user.create.mockResolvedValue({
        id: 1,
        ...createUserDto,
        password: 'hashedPassword',
      })

      const result = await service.create(createUserDto)

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: createUserDto.username },
      })
      expect(mockPrismaService.user.create).toHaveBeenCalled()
      expect(result).toBeDefined()
    })

    it('should throw ConflictException if username already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1, username: 'testuser' })

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException)
    })
  })

  describe('findPage', () => {
    const query: QueryUserDto = { page: 1, pageSize: 10 }

    it('should return paginated users', async () => {
      mockPrismaService.user.count.mockResolvedValue(1)
      mockPrismaService.user.findMany.mockResolvedValue([{ id: 1, username: 'testuser' }])

      const result = await service.findPage(query)

      expect(result.items).toHaveLength(1)
      expect(result.total).toBe(1)
      expect(result.page).toBe(1)
    })
  })

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, username: 'testuser' }
      mockPrismaService.user.findUnique.mockResolvedValue(user)

      const result = await service.findOne(1)

      expect(result).toEqual(user)
    })

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    const updateUserDto: UpdateUserDto = { nickname: 'Updated Nickname' }

    it('should update a user successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1, username: 'testuser' })
      mockPrismaService.user.update.mockResolvedValue({ id: 1, ...updateUserDto })

      const result = await service.update(1, updateUserDto)

      expect(result).toBeDefined()
      expect(mockPrismaService.user.update).toHaveBeenCalled()
    })

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      await expect(service.update(1, updateUserDto)).rejects.toThrow(NotFoundException)
    })

    it('should throw ConflictException if new username already exists', async () => {
      mockPrismaService.user.findUnique
        .mockResolvedValueOnce({ id: 1, username: 'testuser' }) // existing user
        .mockResolvedValueOnce({ id: 2, username: 'newname' }) // another user with new name

      await expect(service.update(1, { username: 'newname' })).rejects.toThrow(ConflictException)
    })
  })

  describe('remove', () => {
    it('should delete users successfully', async () => {
      mockPrismaService.user.deleteMany.mockResolvedValue({ count: 2 })

      const result = await service.remove([1, 2])

      expect(result.count).toBe(2)
      expect(mockPrismaService.user.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2] } },
      })
    })
  })
})
