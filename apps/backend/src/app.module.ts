import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { UsersModule } from './system/users/users.module'
import { RolesModule } from './system/roles/roles.module'
import { PermissionsModule } from './system/permissions/permissions.module'

@Module({
  imports: [UsersModule, RolesModule, PermissionsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
