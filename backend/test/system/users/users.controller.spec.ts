import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '@/system/users/users.controller'
import { UsersService } from '@/system/users/users.service'
import { CreateUserDto } from '@/system/users/dto/create-user.dto'
import { QueryUserDto } from '@/system/users/dto/query-user.dto'
import { UpdateUserDto } from '@/system/users/dto/update-user.dto'

const mockUsersService = {
  create: jest.fn(),
  findPage: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

describe('UsersController', () => {
  let controller: UsersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = { username: 'test', password: '123' }
      mockUsersService.create.mockResolvedValue({ id: 1, ...dto })

      const result = await controller.create(dto)

      expect(result.id).toBe(1)
      expect(mockUsersService.create).toHaveBeenCalledWith(dto)
    })
  })

  describe('findPage', () => {
    it('should return paginated users', async () => {
      const query: QueryUserDto = { page: 1, pageSize: 10 }
      const expectedResult = { items: [], total: 0, page: 1, pageSize: 10 }
      mockUsersService.findPage.mockResolvedValue(expectedResult)

      const result = await controller.findPage(query)

      expect(result).toEqual(expectedResult)
      expect(mockUsersService.findPage).toHaveBeenCalledWith(query)
    })
  })

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user = { id: 1, username: 'test' }
      mockUsersService.findOne.mockResolvedValue(user)

      const result = await controller.findOne(1)

      expect(result).toEqual(user)
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1)
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      const dto: UpdateUserDto = { nickname: 'new' }
      mockUsersService.update.mockResolvedValue({ id: 1, ...dto })

      const result = await controller.update(1, dto)

      expect(result.id).toBe(1)
      expect(mockUsersService.update).toHaveBeenCalledWith(1, dto)
    })
  })

  describe('remove', () => {
    it('should remove users', async () => {
      mockUsersService.remove.mockResolvedValue({ count: 1 })

      const result = await controller.remove('1,2')

      expect(result.count).toBe(1)
      expect(mockUsersService.remove).toHaveBeenCalledWith([1, 2])
    })
  })
})
