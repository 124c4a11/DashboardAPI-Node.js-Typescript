import { NextFunction, Response, Request, Router } from "express";


export interface IControllerRote {
  path: string;
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
  func: (req: Request, res: Response, next: NextFunction) => void;
}
