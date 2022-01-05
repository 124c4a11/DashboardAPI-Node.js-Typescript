import 'reflect-metadata';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { json } from 'body-parser';

import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';
import { ILogger } from './logger/logger.service.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { UserController } from './users/controller/user.controller';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';

@injectable()
export class App {
  app: Express;
  port: number;
  server: Server;

  constructor(
    @inject(TYPES.LoggerService) private logger: ILogger,
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.PrismaService) private prismaService: PrismaService,
  ) {
    this.app = express();
    this.port = 3000;
  }

  useMiddleware(): void {
    const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));

    this.app.use(json());
    this.app.use(authMiddleware.execute.bind(authMiddleware));
  }

  useRoutes(): void {
    this.app.use('/users', this.userController.router);
  }

  useExeptionFilters(): void {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init(): Promise<void> {
    this.useMiddleware();
    this.useRoutes();
    this.useExeptionFilters();

    await this.prismaService.connect();

    this.server = this.app.listen(this.port);

    this.logger.log(`Server is running on http://localhost:${this.port}`);
  }
}
