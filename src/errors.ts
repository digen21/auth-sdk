export class AuthSDKError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "AuthSDKError";
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AuthSDKError {
  constructor(message: string) {
    super(message, 422);
  }
}

export class UnauthorizedError extends AuthSDKError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}
