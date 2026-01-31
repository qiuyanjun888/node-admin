import { Test, TestingModule } from '@nestjs/testing'
import { RolesController } from '@/system/roles/roles.controller'
import { RolesService } from '@/system/roles/roles.service'
import { CreateRoleDto } from '@/system/roles/dto/create-role.dto'
import { QueryRoleDto } from '@/system/roles/dto/query-role.dto'
import { UpdateRoleDto } from '@/system/roles/dto/update-role.dto'

const mockRolesService = {
  create: jest.fn(),
  findPage: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

describe('RolesController', () => {
  let controller: RolesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile()

    controller = module.get<RolesController>(RolesController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a role', async () => {
      const dto: CreateRoleDto = { roleName: 'Admin', roleCode: 'admin' }
      mockRolesService.create.mockResolvedValue({ id: 1, ...dto })

      const result = await controller.create(dto)

      expect(result.id).toBe(1)
      expect(mockRolesService.create).toHaveBeenCalledWith(dto)
    })
  })

  describe('findPage', () => {
    it('should return paginated roles', async () => {
      const query: QueryRoleDto = { page: 1, pageSize: 10 }
      const expectedResult = { items: [], total: 0, page: 1, pageSize: 10 }
      mockRolesService.findPage.mockResolvedValue(expectedResult)

      const result = await controller.findPage(query)

      expect(result).toEqual(expectedResult)
      expect(mockRolesService.findPage).toHaveBeenCalledWith(query)
    })
  })

  describe('findOne', () => {
    it('should return a single role', async () => {
      const role = { id: 1, roleName: 'Admin' }
      mockRolesService.findOne.mockResolvedValue(role)

      const result = await controller.findOne(1)

      expect(result).toEqual(role)
      expect(mockRolesService.findOne).toHaveBeenCalledWith(1)
    })
  })

  describe('update', () => {
    it('should update a role', async () => {
      const dto: UpdateRoleDto = { roleName: 'Super Admin' }
      mockRolesService.update.mockResolvedValue({ id: 1, ...dto })

      const result = await controller.update(1, dto)

      expect(result.id).toBe(1)
      expect(mockRolesService.update).toHaveBeenCalledWith(1, dto)
    })
  })

  describe('remove', () => {
    it('should remove roles (logic delete)', async () => {
      mockRolesService.remove.mockResolvedValue({ count: 1 })

      const result = await controller.remove('1,2')

      expect(result.count).toBe(1)
      expect(mockRolesService.remove).toHaveBeenCalledWith([1, 2])
    })
  })
})
