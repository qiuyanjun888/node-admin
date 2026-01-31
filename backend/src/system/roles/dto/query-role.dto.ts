import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class QueryRoleDto {
  @ApiProperty({ description: 'Page number', example: 1, required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @ApiProperty({ description: 'Page size', example: 10, required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number = 10

  @ApiProperty({ description: 'Role name for search', example: 'Admin', required: false })
  @IsOptional()
  @IsString()
  roleName?: string

  @ApiProperty({ description: 'Role code for search', example: 'admin', required: false })
  @IsOptional()
  @IsString()
  roleCode?: string

  @ApiProperty({
    description: 'Status for filter (1: Enabled, 0: Disabled)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  status?: number
}
