export class AppError extends Error {
  status: number;
  errors: string[] | string;
  constructor(errors: string[] | string, status: number) {
    super();

    this.status = status;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  getErrors() {
    return typeof this.errors === "string" ? [this.errors] : this.errors;
  }
}
