// Error type definitions
export interface AppError extends Error {
    code: string;
    statusCode: number;
    details?: Record<string, unknown>;
}

export interface ValidationError extends AppError {
    code: 'VALIDATION_ERROR';
    statusCode: 400;
    details: {
        field: string;
        message: string;
        value?: unknown;
    };
}

export interface DatabaseError extends AppError {
    code: 'DATABASE_ERROR';
    statusCode: 500;
    details: {
        operation: string;
        collection?: string;
        originalError?: unknown;
    };
}

export interface AuthenticationError extends AppError {
    code: 'AUTHENTICATION_ERROR';
    statusCode: 401;
    details?: {
        token?: string;
        reason?: string;
    };
}

export interface AuthorizationError extends AppError {
    code: 'AUTHORIZATION_ERROR';
    statusCode: 403;
    details?: {
        resource?: string;
        action?: string;
        reason?: string;
    };
}

export interface NotFoundError extends AppError {
    code: 'NOT_FOUND';
    statusCode: 404;
    details: {
        resource: string;
        id?: string;
    };
}

export interface ConflictError extends AppError {
    code: 'CONFLICT';
    statusCode: 409;
    details: {
        resource: string;
        field?: string;
        value?: unknown;
    };
}

// Error factory functions
export function createValidationError(field: string, message: string, value?: unknown): ValidationError {
    const error = new Error(`Validation error: ${message}`) as ValidationError;
    error.code = 'VALIDATION_ERROR';
    error.statusCode = 400;
    error.details = { field, message, value };
    return error;
}

export function createDatabaseError(operation: string, originalError: unknown, collection?: string): DatabaseError {
    const error = new Error(`Database error during ${operation}`) as DatabaseError;
    error.code = 'DATABASE_ERROR';
    error.statusCode = 500;
    error.details = {
        operation,
        ...(collection !== undefined && { collection }),
        ...(originalError !== undefined && { originalError })
    };
    return error;
}

export function createAuthenticationError(message: string, details?: { token?: string; reason?: string }): AuthenticationError {
    const error = new Error(message) as AuthenticationError;
    error.code = 'AUTHENTICATION_ERROR';
    error.statusCode = 401;
    error.details = details ?? {};
    return error;
}

export function createAuthorizationError(resource: string, action: string, reason?: string): AuthorizationError {
    const error = new Error(`Access denied for ${action} on ${resource}`) as AuthorizationError;
    error.code = 'AUTHORIZATION_ERROR';
    error.statusCode = 403;
    error.details = {
        resource,
        action,
        ...(reason !== undefined && { reason })
    };
    return error;
}

export function createNotFoundError(resource: string, id?: string): NotFoundError {
    const error = new Error(`${resource} not found${id ? ` with id ${id}` : ''}`) as NotFoundError;
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    error.details = {
        resource,
        ...(id !== undefined && { id })
    };
    return error;
}

export function createConflictError(resource: string, field?: string, value?: unknown): ConflictError {
    const error = new Error(`${resource} already exists${field ? ` with ${field}: ${value}` : ''}`) as ConflictError;
    error.code = 'CONFLICT';
    error.statusCode = 409;
    error.details = {
        resource,
        ...(field !== undefined && { field }),
        ...(value !== undefined && { value })
    };
    return error;
}

// Type guards for error handling
export function isAppError(error: unknown): error is AppError {
    return error instanceof Error && 'code' in error && 'statusCode' in error;
}

export function isValidationError(error: unknown): error is ValidationError {
    return isAppError(error) && error.code === 'VALIDATION_ERROR';
}

export function isDatabaseError(error: unknown): error is DatabaseError {
    return isAppError(error) && error.code === 'DATABASE_ERROR';
}

export function isAuthenticationError(error: unknown): error is AuthenticationError {
    return isAppError(error) && error.code === 'AUTHENTICATION_ERROR';
}

export function isAuthorizationError(error: unknown): error is AuthorizationError {
    return isAppError(error) && error.code === 'AUTHORIZATION_ERROR';
}

export function isNotFoundError(error: unknown): error is NotFoundError {
    return isAppError(error) && error.code === 'NOT_FOUND';
}

export function isConflictError(error: unknown): error is ConflictError {
    return isAppError(error) && error.code === 'CONFLICT';
}
