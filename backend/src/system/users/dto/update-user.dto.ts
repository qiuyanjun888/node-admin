import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateUserDto } from './create-user.dto'
import { IsOptional, IsNumber } from 'class-validator'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'User Status (1: Enabled, 0: Disabled)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  status?: number
}
