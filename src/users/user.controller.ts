import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';

import { BaseController } from '../common/base.controller';
import { TYPES } from '../types';
import { HTTPError } from '../errors/http-error.class';
import { LoggerService } from '../logger/logger.service';
import { IUserController } from './users.controller.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(@inject(TYPES.LoggerService) private loggerService: LoggerService) {
    super(loggerService);

    this.bindRouts([
      { path: '/register', method: 'post', func: this.register },
      { path: '/login', method: 'post', func: this.login },
    ]);
  }

  register(req: Request, res: Response, next: NextFunction): void {
    this.ok(res, 'register');
  }

  login(req: Request, res: Response, next: NextFunction): void {
    next(new HTTPError(401, 'login error', 'login'));
    // this.ok(res, 'login');
  }
}
