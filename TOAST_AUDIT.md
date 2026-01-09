# Toast Notifications Audit

## Overview

This document audits all toast notifications in the Kost Management Frontend application to ensure consistent messaging patterns for success and error cases.

**Requirements:** 15.4, 19.1

## Toast Library

- **Library:** Sonner (imported from "sonner")
- **Component:** `<Toaster />` from `@/components/ui/sonner`
- **Usage:** `toast.success()`, `toast.error()`, `toast.info()`

## Audit Summary

### ✅ Consistent Patterns Found

1. **Success messages** follow pattern: "[Entity] [action] successfully"
2. **Error handling** uses helper function `getErrorMessage(error)` in most places
3. **Optimistic updates** are implemented in React Query hooks

### ⚠️ Inconsistencies Found

#### 1. Error Message Handling

- **Mixed approaches:**
  - Some use `getErrorMessage(error)` helper ✅
  - Some use inline error extraction ⚠️
  - Some use hardcoded fallback messages ⚠️

#### 2. Validation Errors

- Some validation errors shown via toast
- Some shown via form validation only
- Inconsistent messaging for similar validations

#### 3. Info Toasts

- Used for placeholder functionality (expenses delete/edit)
- Should be standardized or removed

## Detailed Audit by Feature

### 1. Room Management

#### Rooms List (`/rooms/page.tsx`)

- ✅ No toasts (uses hooks)

#### Room Details (`/rooms/[id]/page.tsx`)

- ✅ Success: "Room deleted successfully"
- ✅ Error: Uses `getErrorMessage(error)`

#### Create Room (`/rooms/new/page.tsx`)

- ✅ Success: "Room created successfully"
- ✅ Error: Uses `getErrorMessage(error)`

#### Edit Room (`/rooms/[id]/edit/page.tsx`)

- ✅ Success: "Room updated successfully"
- ✅ Error: Uses `getErrorMessage(error)`

**Status:** ✅ Consistent

---

### 2. Resident Management

#### Residents List (`/residents/page.tsx`)

- ✅ No toasts (uses hooks)

#### Resident Details (`/residents/[id]/page.tsx`)

- ✅ Success: "Resident moved out successfully"
- ✅ Error: Uses `getErrorMessage(error)`

#### Onboard Resident (`/residents/new/page.tsx`)

- ✅ Success: "Resident onboarded successfully"
- ⚠️ Error: Inline extraction with fallback "Failed to onboard resident"

**Status:** ⚠️ Minor inconsistency in error handling

---

### 3. Utility Management

#### Record Utility (`/utilities/new/page.tsx`)

- ✅ Success: "Utility record created successfully"
- ⚠️ Error: Inline extraction with fallback "Failed to record utility"

**Status:** ⚠️ Minor inconsistency in error handling

---

### 4. Invoice Management

#### Invoices List (`/invoices/page.tsx`)

- ✅ No toasts (uses hooks)

#### Invoice Details (`/invoices/[id]/page.tsx`)

- ⚠️ Validation: "Please select a payment status" (before API call)
- ✅ Success: "Payment status updated successfully"
- ⚠️ Error: Inline extraction with fallback "Failed to update status"

#### Generate Invoice (`/invoices/generate/page.tsx`)

- ⚠️ Validation: "Please select a resident" (before API call)
- ✅ Success: "Invoice generated successfully"
- ⚠️ Error: Uses `err.response?.data?.message` with fallback "Failed to generate invoice"

**Status:** ⚠️ Inconsistent error handling and validation messages

---

### 5. Laundry Management

#### Laundry List (`/laundry/page.tsx`)

- ✅ No toasts (uses hooks)

#### Laundry Details (`/laundry/[id]/page.tsx`)

- ⚠️ Validation: "Invalid status transition"
- ⚠️ Validation: "Cannot complete laundry without payment"
- ✅ Success: "Status updated successfully"
- ⚠️ Error: Uses `error.response?.data?.message` with fallback "Failed to update status"
- ✅ Success: "Payment status updated successfully"
- ⚠️ Error: Uses `error.response?.data?.message` with fallback "Failed to update payment status"

#### Create Laundry (`/laundry/new/page.tsx`)

- ✅ Success: "Laundry transaction created successfully"
- ⚠️ Error: Inline extraction with fallback "Failed to create laundry transaction"

**Status:** ⚠️ Multiple inconsistencies

---

### 6. Complaint Management

#### Complaints List (`/complaints/page.tsx`)

- ✅ No toasts (uses hooks)

#### Complaint Details (`/complaints/[id]/page.tsx`)

- ⚠️ Validation: "Invalid status transition"
- ✅ Success: "Status updated successfully"
- ⚠️ Error: Inline extraction with fallback "Failed to update status"

#### Create Complaint (`/complaints/new/page.tsx`)

- ✅ Success: "Complaint submitted successfully"
- ⚠️ Error: Inline extraction with fallback "Failed to submit complaint"

**Status:** ⚠️ Inconsistent error handling

---

### 7. Fridge Management

#### Fridge Items (`/fridge/page.tsx`)

- ✅ Success: "Item added to fridge successfully"
- ⚠️ Error: Inline extraction with fallback "Failed to add item"
- ⚠️ Validation: "Quantity must be at least 1"
- ✅ Success: "Quantity updated successfully"
- ⚠️ Error: Complex inline extraction with fallback "Failed to update quantity"
- ✅ Success: "Item removed from fridge successfully"
- ⚠️ Error: Complex inline extraction with fallback "Failed to delete item"

**Status:** ⚠️ Multiple inconsistencies

---

### 8. Expense Management

#### Expenses List (`/expenses/page.tsx`)

- ✅ No toasts (uses hooks)

#### Expense Details (`/expenses/[id]/page.tsx`)

- ⚠️ Access Control: "Access denied. Only OWNER can view expense details."
- ⚠️ Info: "Delete functionality will be implemented in the API"
- ⚠️ Info: "Edit functionality will be implemented"

#### Create Expense (`/expenses/new/page.tsx`)

- ⚠️ Access Control: "Access denied. Only OWNER can create expenses."
- ✅ Success: "Expense created successfully"
- ⚠️ Error: Uses `error?.message` with fallback "Failed to create expense"

**Status:** ⚠️ Multiple inconsistencies, placeholder toasts

---

### 9. Financial Reports

#### Reports Page (`/reports/page.tsx`)

- ⚠️ Validation: "No report data to export" (appears twice)
- ✅ Success: "Report exported successfully"
- ⚠️ Error: "Failed to export report"
- ✅ Success: "Report with charts exported successfully"
- ⚠️ Error: "Failed to export report with charts"

**Status:** ⚠️ Inconsistent error handling

---

## Recommendations

### 1. Standardize Error Handling

Create a centralized error handler that:

- Extracts API error messages consistently
- Provides user-friendly fallback messages
- Handles different error types (network, validation, server)

### 2. Standardize Success Messages

Pattern: `"[Entity] [action] successfully"`
Examples:

- "Room created successfully" ✅
- "Invoice generated successfully" ✅
- "Payment status updated successfully" ✅

### 3. Validation Messages

- Keep validation toasts for business logic violations
- Use form validation for input errors
- Pattern: Clear, actionable message

### 4. Remove Placeholder Toasts

- Remove `toast.info()` for unimplemented features
- Either implement or remove the UI elements

### 5. Access Control Messages

- Standardize: "Access denied. Only [ROLE] can [action]."
- Consider redirecting instead of showing toast

## Implementation Plan

1. ✅ Create centralized error handler utility
2. ✅ Update all error toast calls to use the utility
3. ✅ Standardize validation messages
4. ✅ Remove or implement placeholder functionality
5. ✅ Document toast usage patterns

## Error Handler Utility

Location: `lib/utils/errorHandler.ts`

```typescript
export function getErrorMessage(error: unknown): string {
  // Axios error with response
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
  }

  // Standard Error object
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback
  return "An unexpected error occurred";
}
```

## Conclusion

The application has a good foundation with consistent success messages, but error handling needs standardization. The main issues are:

1. Mixed error extraction approaches
2. Some placeholder functionality with info toasts
3. Inconsistent validation message patterns

All issues can be resolved by implementing the recommendations above.
