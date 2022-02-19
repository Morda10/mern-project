import express from "express";
import { AppError } from "./appError";

export const routeNotFound = (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
};
