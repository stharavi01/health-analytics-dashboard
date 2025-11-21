/**
 * API Error Types
 * Centralized error type definitions for consistent error handling
 */

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR"
  | "UNKNOWN_ERROR";

export type StatusCode = 400 | 401 | 403 | 404 | 409 | 422 | 500;

/**
 * Standard error response format with error code
 */
export interface StandardErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: any;
  };
}

/**
 * Simple error response format with status code
 */
export interface SimpleErrorResponse {
  message: string;
  statusCode: StatusCode;
}

/**
 * Union type for all possible API error responses
 */
export type ApiErrorResponse = StandardErrorResponse | SimpleErrorResponse;
