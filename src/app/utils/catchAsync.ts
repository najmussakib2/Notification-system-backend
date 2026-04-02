import { NextFunction, RequestHandler, Response } from 'express';
import { AuthRequest } from '../middlewares/rateLimiter';

const catchAsync = (fn: RequestHandler) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;
