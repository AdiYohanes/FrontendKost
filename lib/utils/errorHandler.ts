/**
 * Error Handler Utility
 * Centralized error handling for API errors
 */

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
}

/**
 * Extract user-friendly error message from API error
 */
export function getErrorMessage(error: unknown): string {
  const apiError = error as ApiError;

  // Check for response error message
  if (apiError.response?.data?.message) {
    return apiError.response.data.message;
  }

  if (apiError.response?.data?.error) {
    return apiError.response.data.error;
  }

  // Check for general error message
  if (apiError.message) {
    return apiError.message;
  }

  // Default error message
  return "An unexpected error occurred";
}

/**
 * Check if error is a specific HTTP status code
 */
export function isErrorStatus(error: unknown, status: number): boolean {
  const apiError = error as ApiError;
  return apiError.response?.status === status;
}
