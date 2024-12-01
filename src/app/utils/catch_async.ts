import { NextFunction, Request, Response } from "express";
import { RequestHandler } from "express-serve-static-core";

const catch_async = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default catch_async;
