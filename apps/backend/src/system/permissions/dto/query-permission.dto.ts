import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class QueryPermissionDto {
  @ApiProperty({ description: 'Name keyword', example: 'User', required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ description: 'Type (1: Directory, 2: Menu, 3: Button)', example: 2, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3)
  type?: number

  @ApiProperty({ description: 'Parent ID', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number

  @ApiProperty({ description: 'Status (1: Enabled, 0: Disabled)', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1)
  status?: number
}
