import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator'

export class CreateRoleDto {
  @ApiProperty({ description: 'Role name', example: 'Admin' })
  @IsNotEmpty()
  @IsString()
  roleName: string

  @ApiProperty({ description: 'Role code', example: 'admin' })
  @IsNotEmpty()
  @IsString()
  roleCode: string

  @ApiProperty({ description: 'Description', example: 'System Administrator', required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ description: 'Status (1: Enabled, 0: Disabled)', example: 1, required: false })
  @IsOptional()
  @IsInt()
  status?: number
}
