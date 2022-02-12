import express from "express";
import { Result, ValidationError, validationResult } from "express-validator";

export const isErrors = (
  req: express.Request,
  isExtractMessages?: boolean
): ValidationError[] | string[] | null => {
  const errors = validationResult(req);
  const errorsArray = errors.array();
  if (!errors.isEmpty()) {
    return isExtractMessages ? extractErrors(errorsArray) : errors.array();
  }
  return null;
};

const extractErrors = (errors: ValidationError[]): string[] | null => {
  if (!errors?.length) return null;
  return errors.map((error: ValidationError) => error.msg);
};
