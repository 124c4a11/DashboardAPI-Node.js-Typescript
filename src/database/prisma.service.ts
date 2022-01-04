import { PrismaClient, UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { ILogger } from '../logger/logger.service.interface';
import { TYPES } from '../types';

@injectable()
export class PrismaService {
  client: PrismaClient;

  constructor(@inject(TYPES.LoggerService) private logger: ILogger) {
    this.client = new PrismaClient();
  }

  async connect(): Promise<void> {
    try {
      this.client.$connect();
      this.logger.log('[Prisma Service] Successful connection to the database');
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(`[Prisma Service] Error connecting to database: ${err.message}`);
      }
    }
  }

  async disconnect(): Promise<void> {
    this.client.$disconnect();
  }
}
