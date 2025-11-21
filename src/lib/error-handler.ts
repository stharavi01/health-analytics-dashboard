import type {
  ApiErrorResponse,
  StandardErrorResponse,
  ErrorCode,
  StatusCode,
} from "@/types/api-error.types";

/**
 * Centralized API Error Handler
 * Provides user-friendly error messages based on error codes or status codes
 */
export class ApiErrorHandler {
  /**
   * Type guard to check if error response is in standard format
   */
  private isStandardError(error: unknown): error is StandardErrorResponse {
    return (
      (error as StandardErrorResponse)?.success === false &&
      (error as StandardErrorResponse)?.error?.code !== undefined
    );
  }

  /**
   * Get user-friendly error message from API error response
   */
  getErrorMessage(errorResponse: ApiErrorResponse): string {
    if (this.isStandardError(errorResponse)) {
      return (
        errorResponse.error.message ||
        this.mapErrorCodeToMessage(errorResponse.error.code as ErrorCode)
      );
    } else {
      return (
        errorResponse.message ||
        this.mapStatusCodeToMessage(errorResponse.statusCode as StatusCode)
      );
    }
  }

  /**
   * Map error codes to user-friendly messages
   */
  private mapErrorCodeToMessage(errorCode: ErrorCode): string {
    const errorMessages: Record<ErrorCode, string> = {
      VALIDATION_ERROR: "Please check your input and try again",
      UNAUTHORIZED: "Please log in to continue",
      FORBIDDEN: "You don't have permission to do this",
      NOT_FOUND: "The requested resource was not found",
      CONFLICT: "This already exists. Please choose a different value",
      BAD_REQUEST: "Invalid request. Please check your input",
      INTERNAL_SERVER_ERROR:
        "Something went wrong on our end. Please try again",
      UNKNOWN_ERROR: "An unexpected error occurred",
    };
    return errorMessages[errorCode] || "An unexpected error occurred";
  }

  /**
   * Map HTTP status codes to user-friendly messages
   */
  private mapStatusCodeToMessage(statusCode: StatusCode): string {
    const statusMessages: Record<StatusCode, string> = {
      400: "Invalid request. Please check your input",
      401: "Please log in to continue",
      403: "You don't have permission to do this",
      404: "The requested resource was not found",
      409: "This already exists. Please choose a different value",
      422: "Please check your input and try again",
      500: "Something went wrong on our end. Please try again",
    };
    return statusMessages[statusCode] || "An unexpected error occurred";
  }

  /**
   * Extract error details from response (if available)
   */
  getErrorDetails(errorResponse: ApiErrorResponse): unknown {
    if (this.isStandardError(errorResponse)) {
      return errorResponse.error.details;
    }
    return null;
  }
}

/**
 * Singleton instance for use throughout the application
 */
export const apiErrorHandler = new ApiErrorHandler();
