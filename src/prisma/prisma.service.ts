import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
// 1. Extend PrismaClient
export class PrismaService extends PrismaClient implements OnModuleInit {
  // 2. Add the onModuleInit hook to connect to the DB
  async onModuleInit() {
    await this.$connect();
  }
}
