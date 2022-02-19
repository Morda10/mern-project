import express from "express";
import { AppError } from "../utils/appError";

export const globalErrorHandler = (
  err: AppError,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  err.status = err.status;

  res.status(err.status).json({
    errors: err.getErrors(),
  });
};
