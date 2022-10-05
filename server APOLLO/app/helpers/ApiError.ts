export class ApiError extends Error {
  status;
  errors;

  constructor(status: number, message: string, errors = []) {
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

  static BadRequest(message: string, errors = []) {
    return new ApiError(400, message, errors);
  }
}
