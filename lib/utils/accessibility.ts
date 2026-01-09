/**
 * Accessibility Utilities
 * Provides helper functions and constants for WCAG 2.1 AA compliance
 */

/**
 * Generate unique IDs for ARIA relationships
 */
export function generateAriaId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * ARIA live region announcer for dynamic content
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
): void {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * ARIA labels for common actions
 */
export const ARIA_LABELS = {
  // Navigation
  navigation: {
    main: "Main navigation",
    breadcrumb: "Breadcrumb navigation",
    pagination: "Pagination navigation",
    skipToMain: "Skip to main content",
    skipToNav: "Skip to navigation",
  },

  // Actions
  actions: {
    close: "Close",
    open: "Open",
    delete: "Delete",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    refresh: "Refresh",
    download: "Download",
    upload: "Upload",
    add: "Add",
    remove: "Remove",
    expand: "Expand",
    collapse: "Collapse",
    toggleMenu: "Toggle menu",
    toggleSidebar: "Toggle sidebar",
    logout: "Logout",
  },

  // Status
  status: {
    loading: "Loading",
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",
  },

  // Forms
  forms: {
    required: "Required field",
    optional: "Optional field",
    invalid: "Invalid input",
    valid: "Valid input",
    showPassword: "Show password",
    hidePassword: "Hide password",
  },

  // Data
  data: {
    noResults: "No results found",
    emptyState: "No data available",
    loadingData: "Loading data",
    sortAscending: "Sort ascending",
    sortDescending: "Sort descending",
  },
} as const;

/**
 * Get ARIA label for room status
 */
export function getRoomStatusAriaLabel(status: string): string {
  const labels: Record<string, string> = {
    AVAILABLE: "Room is available",
    OCCUPIED: "Room is occupied",
    MAINTENANCE: "Room is under maintenance",
  };
  return labels[status] || status;
}

/**
 * Get ARIA label for payment status
 */
export function getPaymentStatusAriaLabel(status: string): string {
  const labels: Record<string, string> = {
    UNPAID: "Payment is unpaid",
    PAID: "Payment is completed",
    PARTIAL: "Payment is partially completed",
  };
  return labels[status] || status;
}

/**
 * Get ARIA label for complaint status
 */
export function getComplaintStatusAriaLabel(status: string): string {
  const labels: Record<string, string> = {
    OPEN: "Complaint is open",
    IN_PROGRESS: "Complaint is in progress",
    RESOLVED: "Complaint is resolved",
  };
  return labels[status] || status;
}

/**
 * Get ARIA label for laundry status
 */
export function getLaundryStatusAriaLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Laundry is pending",
    ON_PROCESS: "Laundry is being processed",
    READY_TO_PICKUP: "Laundry is ready for pickup",
    COMPLETED: "Laundry is completed",
  };
  return labels[status] || status;
}

/**
 * Get ARIA label for user role
 */
export function getUserRoleAriaLabel(role: string): string {
  const labels: Record<string, string> = {
    OWNER: "Owner role",
    PENJAGA: "Staff role",
    PENGHUNI: "Tenant role",
  };
  return labels[role] || role;
}

/**
 * Format currency for screen readers
 */
export function formatCurrencyForScreenReader(amount: number): string {
  return `${amount.toLocaleString("id-ID")} rupiah`;
}

/**
 * Format date for screen readers
 */
export function formatDateForScreenReader(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Create accessible error message
 */
export function createErrorMessage(fieldName: string, error: string): string {
  return `${fieldName}: ${error}`;
}

/**
 * Create accessible success message
 */
export function createSuccessMessage(action: string, item: string): string {
  return `${action} ${item} successfully`;
}

/**
 * Keyboard navigation helpers
 */
export const KEYBOARD_KEYS = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  TAB: "Tab",
  HOME: "Home",
  END: "End",
} as const;

/**
 * Check if key is action key (Enter or Space)
 */
export function isActionKey(key: string): boolean {
  return key === KEYBOARD_KEYS.ENTER || key === KEYBOARD_KEYS.SPACE;
}

/**
 * Handle keyboard action
 */
export function handleKeyboardAction(
  event: React.KeyboardEvent,
  callback: () => void
): void {
  if (isActionKey(event.key)) {
    event.preventDefault();
    callback();
  }
}
