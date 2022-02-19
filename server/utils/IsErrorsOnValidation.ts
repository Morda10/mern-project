import express from "express";
import { ValidationError, validationResult } from "express-validator";
import { AppError } from "./appError";

export const isErrors = (req: express.Request, next: express.NextFunction): boolean => {
  const errors = validationResult(req);
  const errorsArray = errors.array();
  if (!errors.isEmpty()) {
    const validationErrors = extractErrors(errorsArray);
    if (validationErrors?.length) {
      next(new AppError(validationErrors, 400))
      return true;
    };
  }
  return false;
};

const extractErrors = (errors: ValidationError[]): string[] | null => {
  if (!errors?.length) return null;
  return errors.map((error: ValidationError) => error.msg);
};
