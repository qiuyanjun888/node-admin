import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!'
  }

  async getDatabaseTime() {
    const result: any[] = await this.prisma.$queryRaw`SELECT NOW()`
    return result[0].now
  }
}
