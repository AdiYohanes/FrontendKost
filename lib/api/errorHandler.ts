import { AxiosError } from 'axios';

/**
 * API Error Response Type
 */
export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
}

/**
 * Handle API errors and return user-friendly messages
 * @param error - Axios error object
 * @returns User-friendly error message
 */
export function handleApiError(error: AxiosError<ApiErrorResponse>): string {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return data?.message || 'Invalid request. Please check your input.';
      
      case 401:
        return 'Session expired. Please login again.';
      
      case 403:
        return 'You do not have permission to perform this action.';
      
      case 404:
        return data?.message || 'Resource not found.';
      
      case 409:
        return data?.message || 'Conflict. Resource already exists.';
      
      case 422:
        return data?.message || 'Validation error. Please check your input.';
      
      case 500:
        return 'Server error. Please try again later.';
      
      case 503:
        return 'Service unavailable. Please try again later.';
      
      default:
        return data?.message || 'An error occurred. Please try again.';
    }
  } else if (error.request) {
    // Request made but no response received
    return 'Tidak dapat terhubung ke server. Pastikan:\n• Backend API berjalan di http://localhost:3000\n• Koneksi internet Anda stabil\n• Tidak ada firewall yang memblokir koneksi';
  } else {
    // Error in request setup
    return error.message || 'An unexpected error occurred.';
  }
}

/**
 * Check if error is an authentication error
 * @param error - Axios error object
 * @returns True if error is 401 Unauthorized
 */
export function isAuthError(error: AxiosError): boolean {
  return error.response?.status === 401;
}

/**
 * Check if error is a network error
 * @param error - Axios error object
 * @returns True if error is a network error
 */
export function isNetworkError(error: AxiosError): boolean {
  return !error.response && !!error.request;
}

/**
 * Extract validation errors from API response
 * @param error - Axios error object
 * @returns Object with field-specific error messages
 */
export function extractValidationErrors(
  error: AxiosError<ApiErrorResponse & { errors?: Record<string, string[]> }>
): Record<string, string> | null {
  if (error.response?.status === 422 && error.response.data?.errors) {
    const errors: Record<string, string> = {};
    
    Object.entries(error.response.data.errors).forEach(([field, messages]) => {
      errors[field] = messages[0]; // Take first error message for each field
    });
    
    return errors;
  }
  
  return null;
}
