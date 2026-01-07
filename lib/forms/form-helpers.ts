import { FieldErrors, FieldValues } from 'react-hook-form';

/**
 * Get error message from field errors
 * @param errors - Field errors from React Hook Form
 * @param fieldName - Name of the field
 * @returns Error message or undefined
 */
export function getErrorMessage<T extends FieldValues>(
  errors: FieldErrors<T>,
  fieldName: keyof T
): string | undefined {
  const error = errors[fieldName];
  if (!error) return undefined;

  if (typeof error.message === 'string') {
    return error.message;
  }

  return 'Invalid value';
}

/**
 * Check if field has error
 * @param errors - Field errors from React Hook Form
 * @param fieldName - Name of the field
 * @returns True if field has error
 */
export function hasError<T extends FieldValues>(
  errors: FieldErrors<T>,
  fieldName: keyof T
): boolean {
  return !!errors[fieldName];
}

/**
 * Get field state classes for styling
 * @param errors - Field errors from React Hook Form
 * @param fieldName - Name of the field
 * @returns CSS classes for field state
 */
export function getFieldStateClasses<T extends FieldValues>(
  errors: FieldErrors<T>,
  fieldName: keyof T
): string {
  if (hasError(errors, fieldName)) {
    return 'border-red-500 focus:border-red-500 focus:ring-red-500';
  }
  return '';
}

/**
 * Format form data for API submission
 * Removes empty strings and null values
 * @param data - Form data
 * @returns Cleaned form data
 */
export function cleanFormData<T extends Record<string, unknown>>(
  data: T
): Partial<T> {
  const cleaned: Partial<T> = {};

  for (const key in data) {
    const value = data[key];

    // Skip empty strings and null values
    if (value === '' || value === null) {
      continue;
    }

    // Keep all other values including 0, false, empty arrays
    cleaned[key] = value;
  }

  return cleaned;
}

/**
 * Convert form data to FormData for file uploads
 * @param data - Form data object
 * @returns FormData instance
 */
export function toFormData(data: Record<string, unknown>): FormData {
  const formData = new FormData();

  for (const key in data) {
    const value = data[key];

    if (value === null || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      // Handle arrays (e.g., multiple files)
      value.forEach((item) => {
        if (item instanceof File) {
          formData.append(key, item);
        } else {
          formData.append(key, String(item));
        }
      });
    } else if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  }

  return formData;
}

/**
 * Reset form with default values
 * @param reset - Reset function from React Hook Form
 * @param defaultValues - Default values to reset to
 */
export function resetFormWithDefaults<T extends FieldValues>(
  reset: (values?: T) => void,
  defaultValues?: T
): void {
  if (defaultValues) {
    reset(defaultValues);
  } else {
    reset();
  }
}

/**
 * Scroll to first error in form
 * @param errors - Field errors from React Hook Form
 */
export function scrollToFirstError<T extends FieldValues>(
  errors: FieldErrors<T>
): void {
  const firstErrorField = Object.keys(errors)[0];
  if (!firstErrorField) return;

  const element = document.querySelector(`[name="${firstErrorField}"]`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    (element as HTMLElement).focus();
  }
}

/**
 * Get all error messages as array
 * @param errors - Field errors from React Hook Form
 * @returns Array of error messages
 */
export function getAllErrorMessages<T extends FieldValues>(
  errors: FieldErrors<T>
): string[] {
  const messages: string[] = [];

  for (const key in errors) {
    const error = errors[key];
    if (error && typeof error.message === 'string') {
      messages.push(error.message);
    }
  }

  return messages;
}

/**
 * Check if form is dirty (has unsaved changes)
 * @param dirtyFields - Dirty fields from React Hook Form
 * @returns True if form has unsaved changes
 */
export function isFormDirty<T extends FieldValues>(
  dirtyFields: Partial<Record<keyof T, boolean>>
): boolean {
  return Object.keys(dirtyFields).length > 0;
}

/**
 * Format date for input field (YYYY-MM-DD)
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDateForInput(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
}

/**
 * Parse date from input field
 * @param dateString - Date string from input (YYYY-MM-DD)
 * @returns ISO date string
 */
export function parseDateFromInput(dateString: string): string {
  return new Date(dateString).toISOString();
}
