import { NextFunction, Response, Request, Router } from 'express';

import { IMiddleware } from './middleware.interface';

export interface IControllerRote {
  path: string;
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
  func: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
