import { AxiosError } from 'axios';
import { UseFormSetError, FieldValues, Path } from 'react-hook-form';

/**
 * API Error Response Type
 */
interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

/**
 * Handle API errors and set form field errors
 * @param error - Axios error from API
 * @param setError - setError function from React Hook Form
 * @returns Error message for toast/alert
 */
export function handleFormApiError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
): string {
  if (!(error instanceof AxiosError)) {
    return 'An unexpected error occurred';
  }

  const response = error.response?.data as ApiErrorResponse | undefined;

  // Handle validation errors (400)
  if (error.response?.status === 400 && response?.errors) {
    // Set field-specific errors
    for (const [field, messages] of Object.entries(response.errors)) {
      if (messages && messages.length > 0) {
        setError(field as Path<T>, {
          type: 'server',
          message: messages[0],
        });
      }
    }
    return response.message || 'Validation failed. Please check your input.';
  }

  // Handle authentication errors (401)
  if (error.response?.status === 401) {
    return 'Session expired. Please login again.';
  }

  // Handle authorization errors (403)
  if (error.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  // Handle not found errors (404)
  if (error.response?.status === 404) {
    return 'Resource not found.';
  }

  // Handle conflict errors (409)
  if (error.response?.status === 409) {
    return response?.message || 'A conflict occurred. The resource may already exist.';
  }

  // Handle server errors (500+)
  if (error.response?.status && error.response.status >= 500) {
    return 'Server error. Please try again later.';
  }

  // Handle network errors
  if (error.request && !error.response) {
    return 'Network error. Please check your connection.';
  }

  // Default error message
  return response?.message || 'An error occurred. Please try again.';
}

/**
 * Set server error on specific field
 * @param setError - setError function from React Hook Form
 * @param fieldName - Name of the field
 * @param message - Error message
 */
export function setServerError<T extends FieldValues>(
  setError: UseFormSetError<T>,
  fieldName: Path<T>,
  message: string
): void {
  setError(fieldName, {
    type: 'server',
    message,
  });
}

/**
 * Clear all server errors
 * @param clearErrors - clearErrors function from React Hook Form
 */
export function clearServerErrors<T extends FieldValues>(
  clearErrors: (name?: Path<T> | Path<T>[]) => void
): void {
  clearErrors();
}

/**
 * Extract error message from unknown error
 * @param error - Unknown error object
 * @returns Error message string
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse | undefined;
    return response?.message || error.message || 'An error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}

/**
 * Check if error is validation error
 * @param error - Error object
 * @returns True if validation error
 */
export function isValidationError(error: unknown): boolean {
  if (!(error instanceof AxiosError)) {
    return false;
  }

  return error.response?.status === 400;
}

/**
 * Check if error is authentication error
 * @param error - Error object
 * @returns True if authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (!(error instanceof AxiosError)) {
    return false;
  }

  return error.response?.status === 401;
}

/**
 * Check if error is authorization error
 * @param error - Error object
 * @returns True if authorization error
 */
export function isAuthorizationError(error: unknown): boolean {
  if (!(error instanceof AxiosError)) {
    return false;
  }

  return error.response?.status === 403;
}

/**
 * Check if error is network error
 * @param error - Error object
 * @returns True if network error
 */
export function isNetworkError(error: unknown): boolean {
  if (!(error instanceof AxiosError)) {
    return false;
  }

  return !!error.request && !error.response;
}
