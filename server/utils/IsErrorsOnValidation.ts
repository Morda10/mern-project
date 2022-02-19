import express from "express";
import { ValidationError, validationResult } from "express-validator";
import { AppError } from "./appError";

export const isErrors = (req: express.Request): void => {
  try {
    const errors = validationResult(req);
    const errorsArray = errors.array();
    if (!errors.isEmpty()) {
      const validationErrors = extractErrors(errorsArray);
      if (validationErrors?.length) throw new Error(validationErrors);
    }
  } catch (err: AppError) {}
};

const extractErrors = (errors: ValidationError[]): string[] | null => {
  if (!errors?.length) return null;
  return errors.map((error: ValidationError) => error.msg);
};
