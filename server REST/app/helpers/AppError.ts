import { ValidationError } from "express-validator";

interface IAppError {
  status?: number;
  message?: string;
  errors?: [];
  name?: string;
}

export class AppError {
  status?: number;
  message?: string;
  errors?: [];
  name?: string;
  stack;

  constructor({ status, message, errors, name }: IAppError) {
    Error.call(this);

    this.message = message;
    this.status = status;
    this.errors = errors;
    this.name = name;
    this.stack = new Error().stack;
  }
}

export class ApiError extends Error {
  status;
  errors;

  constructor(status: number, message: string, errors: ValidationError[] | any = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static IdPlane() {
    return new ApiError(404, "ID was not find!!");
  }

  static ExistPlane() {
    return new ApiError(409, "Plane allready exist!!");
  }

  static UnauthorizedError() {
    return new ApiError(401, "User not autorized!!");
  }

  static BadRequest(message: string, errors: ValidationError[] = []) {
    return new ApiError(400, message, errors);
  }
}
