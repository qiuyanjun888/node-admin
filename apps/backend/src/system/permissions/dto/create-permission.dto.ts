import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreatePermissionDto {
  @ApiProperty({ description: 'Permission name', example: 'User Management' })
  @IsString()
  name: string

  @ApiProperty({ description: 'Type (1: Directory, 2: Menu, 3: Button)', example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3)
  type: number

  @ApiProperty({ description: 'Parent permission ID', example: 0, required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number

  @ApiProperty({ description: 'Route path', example: '/system/user', required: false })
  @IsOptional()
  @IsString()
  path?: string

  @ApiProperty({ description: 'Component path', example: 'system/user/index', required: false })
  @IsOptional()
  @IsString()
  component?: string

  @ApiProperty({ description: 'Sort order', example: 1, required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number

  @ApiProperty({ description: 'Visibility (1: Show, 0: Hide)', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1)
  isVisible?: number

  @ApiProperty({ description: 'Permission code for actions', example: 'sys:user:add', required: false })
  @IsOptional()
  @IsString()
  permissionCode?: string

  @ApiProperty({ description: 'Status (1: Enabled, 0: Disabled)', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1)
  status?: number
}
