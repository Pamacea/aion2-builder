/**
 * Custom Error Classes for AION2Builder
 * Provides structured error handling with error codes for proper client responses
 */

// ======================================
// BASE ERROR CLASS
// ======================================
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ======================================
// AUTHORIZATION ERRORS (403)
// ======================================
export class AuthorizationError extends AppError {
  constructor(message: string = "You are not authorized to perform this action") {
    super(message, "UNAUTHORIZED", 403);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "You must be logged in to perform this action") {
    super(message, "UNAUTHENTICATED", 401);
  }
}

// ======================================
// VALIDATION ERRORS (400)
// ======================================
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

// ======================================
// NOT FOUND ERRORS (404)
// ======================================
export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, "NOT_FOUND", 404);
  }
}

// ======================================
// BUSINESS LOGIC ERRORS (400)
// ======================================
export class BusinessLogicError extends AppError {
  constructor(message: string, code: string = "BUSINESS_LOGIC_ERROR") {
    super(message, code, 400);
  }
}

// ======================================
// BUILD-SPECIFIC ERRORS
// ======================================
export class BuildNotFoundError extends NotFoundError {
  constructor() {
    super("Build");
  }
}

export class StarterBuildLockedError extends BusinessLogicError {
  constructor() {
    super(
      "Cannot modify starter builds. Please create a new build from the starter build.",
      "STARTER_BUILD_LOCKED"
    );
  }
}

export class BuildOwnershipError extends AuthorizationError {
  constructor() {
    super("You are not authorized to modify this build. Only the owner can modify it.");
  }
}

// ======================================
// ERROR CODES ENUM
// ======================================
export const ErrorCodes = {
  // Auth errors
  UNAUTHENTICATED: "UNAUTHENTICATED",
  UNAUTHORIZED: "UNAUTHORIZED",

  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",

  // Not found errors
  NOT_FOUND: "NOT_FOUND",
  BUILD_NOT_FOUND: "BUILD_NOT_FOUND",

  // Business logic errors
  STARTER_BUILD_LOCKED: "STARTER_BUILD_LOCKED",
  BUILD_OWNERSHIP_ERROR: "BUILD_OWNERSHIP_ERROR",

  // Generic
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

// ======================================
// ERROR UTILITIES
// ======================================
/**
 * Check if error is an AppError instance
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: unknown) {
  if (isAppError(error)) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  // Handle unknown errors
  if (error instanceof Error) {
    return {
      code: ErrorCodes.INTERNAL_ERROR,
      message: error.message,
      statusCode: 500,
    };
  }

  return {
    code: ErrorCodes.INTERNAL_ERROR,
    message: "An unknown error occurred",
    statusCode: 500,
  };
}
