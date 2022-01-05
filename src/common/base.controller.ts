import 'reflect-metadata';
import { Response, Router } from 'express';
import { injectable } from 'inversify';

import { IControllerRote, ExpressReturnType } from './rout.interface';
import { ILogger } from '../logger/logger.service.interface';

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  constructor(private logger: ILogger) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  public send<T>(res: Response, code: number, message: T): ExpressReturnType {
    res.type('application/json');

    return res.status(code).json(message);
  }

  public ok<T>(res: Response, message: T): ExpressReturnType {
    return this.send<T>(res, 200, message);
  }

  public created(res: Response): ExpressReturnType {
    return res.status(201);
  }

  protected bindRouts(routs: IControllerRote[]): void {
    for (const route of routs) {
      this.logger.log(`[${route.method}] ${route.path}`);

      const middlewares = route.middlewares?.map((m) => m.execute.bind(m));
      const handler = route.func.bind(this);
      const pipeline = middlewares ? [...middlewares, handler] : handler;

      this.router[route.method](route.path, pipeline);
    }
  }
}
