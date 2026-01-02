import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!'
  }

  async getDatabaseTime(): Promise<string | undefined> {
    const result = await this.prisma.$queryRaw<{ now: string }[]>`SELECT NOW()`
    return result[0]?.now
  }
}
