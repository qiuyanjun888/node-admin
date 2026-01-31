import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { QueryRoleDto } from './dto/query-role.dto'

@ApiTags('System - Role Management')
@Controller('system/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'The role has been successfully created.' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated list of roles' })
  findPage(@Query() query: QueryRoleDto) {
    return this.rolesService.findPage(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update role' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto)
  }

  @Delete(':ids')
  @ApiOperation({ summary: 'Delete role(s) (Logic delete - disable status)' })
  remove(@Param('ids') ids: string) {
    const idArray = ids.split(',').map((id) => parseInt(id, 10))
    return this.rolesService.remove(idArray)
  }
}
