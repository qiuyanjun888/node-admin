import { ApiProperty } from '@nestjs/swagger'
import { ArrayUnique, IsArray, IsInt } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateRolePermissionsDto {
  @ApiProperty({
    description: 'Permission ID list for the role',
    example: [1, 2, 3],
    isArray: true,
    type: Number,
  })
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Type(() => Number)
  permissionIds: number[]
}
