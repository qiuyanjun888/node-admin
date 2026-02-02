import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { PermissionsService } from './permissions.service'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { QueryPermissionDto } from './dto/query-permission.dto'

@ApiTags('System - Permission Management')
@Controller('system/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all permissions (flat list)' })
  @ApiResponse({ status: 200, description: 'All permissions retrieved successfully.' })
  findAll(@Query() query: QueryPermissionDto) {
    return this.permissionsService.findAll(query)
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get permissions tree' })
  @ApiResponse({ status: 200, description: 'Permission tree retrieved successfully.' })
  findTree() {
    return this.permissionsService.findTree()
  }

  @Get('menus')
  @ApiOperation({ summary: 'Get menu tree (optional role filter)' })
  @ApiResponse({ status: 200, description: 'Menu tree retrieved successfully.' })
  getMenuTree(@Query('roleId') roleId?: string) {
    const parsedRoleId = roleId ? Number(roleId) : undefined
    if (parsedRoleId !== undefined && Number.isNaN(parsedRoleId)) {
      throw new BadRequestException('roleId must be a number')
    }
    return this.permissionsService.findMenuTree(parsedRoleId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get permission by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.findOne(id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a permission' })
  @ApiResponse({ status: 201, description: 'Permission created successfully.' })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a permission' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto)
  }

  @Delete(':ids')
  @ApiOperation({ summary: 'Delete permission(s) (Logic delete - disable status)' })
  remove(@Param('ids') ids: string) {
    const idArray = ids.split(',').map((id) => parseInt(id, 10))
    return this.permissionsService.remove(idArray)
  }
}
