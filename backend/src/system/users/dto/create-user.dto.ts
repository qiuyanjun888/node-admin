import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ description: 'Username', example: 'admin' })
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty({ description: 'Password', example: '123456' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ description: 'Nickname', example: 'Administrator', required: false })
  @IsOptional()
  @IsString()
  nickname?: string

  @ApiProperty({ description: 'Email', example: 'admin@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({
    description: 'Avatar URL',
    example: 'https://example.com/avatar.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string
}
