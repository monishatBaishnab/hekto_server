import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import http_error from "../errors/http_error";
import sanitize_prisma_error from "../errors/prisma_error";

const global_error = (err: any, req: Request, res: Response, next: NextFunction) => {
    const success: boolean = false;
    let status: number = err?.statusCode || httpStatus.BAD_REQUEST;
    let message: string = err?.name || "Something want wrong.";
  
    // console.log(err);
    if (err instanceof ZodError) {
      message = "Validation failed, check the input data for errors.";
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = sanitize_prisma_error(err);

      message = prismaError.message;
      status = prismaError.statusCode;
    } else if (err instanceof http_error) {
      status = err.statusCode;
      message = err.message;
    }
  
    console.log(err);

    res.status(status).send({
      success,
      status,
      message,
    });
  };

export default global_error;
