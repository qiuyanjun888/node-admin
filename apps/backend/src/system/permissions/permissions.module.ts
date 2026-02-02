import { Module } from '@nestjs/common'
import { PermissionsController } from './permissions.controller'
import { PermissionsService } from './permissions.service'
import { PrismaService } from '@/prisma.service'
import { PermissionsSeedService } from './permissions.seed'

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PrismaService, PermissionsSeedService],
})
export class PermissionsModule {}
