import { NextFunction, Request, Response } from "express";
import catch_async from "../utils/catch_async";
import http_error from "../errors/http_error";
import { verify_token } from "../utils/jsonwebtoken";
import { local_config } from "../config";
import httpStatus from "http-status";

const auth = (...roles: string[]) => {
  return catch_async((req: Request, res: Response, next: NextFunction) => {

    const token = req?.headers?.authorization;
    console.log(token);
    if (!token) {
      console.log(token);
      throw new http_error(httpStatus.UNAUTHORIZED, "You are not authorized.");
    }

    const verified_user = verify_token(token, local_config.user_jwt_secret as string);

    if (roles?.length && roles.includes(verified_user.role)) {
      req.user = verified_user;
      next();
    } else {
      throw new http_error(httpStatus.UNAUTHORIZED, "You are not authorized.");
    }
  });
};

export default auth;
