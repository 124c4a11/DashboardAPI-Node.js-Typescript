import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { sign } from 'jsonwebtoken';

import { BaseController } from '../../common/base.controller';
import { TYPES } from '../../types';
import { HTTPError } from '../../errors/http-error.class';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { ValidateMiddleware } from '../../common/validate.middleware';
import { ILogger } from '../../logger/logger.service.interface';
import { IUserService } from '../service/users.service.interface';
import { IConfigService } from '../../config/config.service.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.LoggerService) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.ConfigService) private configService: IConfigService,
  ) {
    super(loggerService);

    this.bindRouts([
      {
        path: '/register',
        method: 'post',
        func: this.register,
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
      {
        path: '/login',
        method: 'post',
        func: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
      {
        path: '/info',
        method: 'get',
        func: this.info,
        middlewares: [],
      },
    ]);
  }

  async register(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.userService.createUser(body);

    if (!result) {
      return next(new HTTPError(422, 'User already exists'));
    }

    this.ok(res, result);
  }

  async login(
    { body }: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.userService.validateUser(body);

    if (!result) {
      return next(new HTTPError(401, 'login error', 'login'));
    }

    const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));

    this.ok(res, { jwt });
  }

  async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
    this.ok(res, { email: user });
  }

  private signJWT(email: string, secret: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sign(
        {
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        {
          algorithm: 'HS256',
        },
        (err, token) => {
          if (err) reject(err);

          resolve(token as string);
        },
      );
    });
  }
}
