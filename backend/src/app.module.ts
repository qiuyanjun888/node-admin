import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { UsersModule } from './system/users/users.module'

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
