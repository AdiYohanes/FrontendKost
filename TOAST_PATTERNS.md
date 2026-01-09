# Toast Notification Patterns

## Overview

This document defines the standardized patterns for toast notifications in the Kost Management Frontend application.

## Success Messages

### Pattern

`"[Entity] [action] successfully"`

### Examples

- ✅ "Room created successfully"
- ✅ "Room updated successfully"
- ✅ "Room deleted successfully"
- ✅ "Resident onboarded successfully"
- ✅ "Resident moved out successfully"
- ✅ "Utility record created successfully"
- ✅ "Invoice generated successfully"
- ✅ "Payment status updated successfully"
- ✅ "Status updated successfully"
- ✅ "Laundry transaction created successfully"
- ✅ "Complaint submitted successfully"
- ✅ "Item added to fridge successfully"
- ✅ "Item removed from fridge successfully"
- ✅ "Quantity updated successfully"
- ✅ "Expense created successfully"
- ✅ "Report exported successfully"
- ✅ "Report with charts exported successfully"

## Error Messages

### Pattern

Use the centralized `getErrorMessage(error)` utility from `@/lib/utils/errorHandler`

### Implementation

```typescript
import { getErrorMessage } from "@/lib/utils/errorHandler";

try {
  // API call
} catch (error) {
  toast.error(getErrorMessage(error));
}
```

### Error Handler Behavior

The `getErrorMessage` utility handles:

1. **API errors with response**: Extracts `error.response.data.message` or `error.response.data.error`
2. **Standard Error objects**: Returns `error.message`
3. **Unknown errors**: Returns "An unexpected error occurred"

### Benefits

- Consistent error message extraction
- Handles different error types automatically
- User-friendly fallback messages
- Centralized error handling logic

## Validation Messages

### Pattern

Clear, actionable messages for business logic violations

### Examples

- ⚠️ "Please select a resident"
- ⚠️ "Please select a payment status"
- ⚠️ "Quantity must be at least 1"
- ⚠️ "Invalid status transition"
- ⚠️ "Cannot complete laundry without payment"
- ⚠️ "No report data to export"

### When to Use

- Pre-API call validation
- Business rule violations
- User input validation (in addition to form validation)

## Access Control Messages

### Pattern

`"Access denied. Only [ROLE] can [action]."`

### Examples

- 🔒 "Access denied. Only OWNER can create expenses."
- 🔒 "Access denied. Only OWNER can view expense details."

### Implementation Note

Consider redirecting users instead of showing toast for better UX:

```typescript
useEffect(() => {
  if (user && user.role !== "OWNER") {
    router.push("/dashboard");
  }
}, [user, router]);
```

## Info Messages

### Pattern

Use sparingly for informational messages

### Current Usage

- ℹ️ "Delete functionality will be implemented in the API" (placeholder)
- ℹ️ "Edit functionality will be implemented" (placeholder)

### Recommendation

Remove placeholder info toasts and either:

1. Implement the functionality
2. Remove the UI element
3. Disable the button with a tooltip

## Anti-Patterns to Avoid

### ❌ Inline Error Extraction

```typescript
// DON'T DO THIS
catch (error) {
  const errorMessage = error instanceof Error
    ? error.message
    : "Failed to do something";
  toast.error(errorMessage);
}
```

### ✅ Use Centralized Handler

```typescript
// DO THIS INSTEAD
catch (error) {
  toast.error(getErrorMessage(error));
}
```

### ❌ Complex Error Type Checking

```typescript
// DON'T DO THIS
catch (error: unknown) {
  const errorMessage =
    error instanceof Error && "response" in error
      ? (error as { response?: { data?: { message?: string } } })
          .response?.data?.message || "Failed"
      : "Failed";
  toast.error(errorMessage);
}
```

### ✅ Use Centralized Handler

```typescript
// DO THIS INSTEAD
catch (error) {
  toast.error(getErrorMessage(error));
}
```

## Implementation Checklist

### For New Features

- [ ] Use `getErrorMessage(error)` for all error handling
- [ ] Follow success message pattern: "[Entity] [action] successfully"
- [ ] Use clear validation messages for business rules
- [ ] Import toast from "sonner"
- [ ] Import getErrorMessage from "@/lib/utils/errorHandler"

### For Existing Features

- [x] Audit all toast usage
- [x] Standardize error handling with `getErrorMessage`
- [x] Ensure consistent success messages
- [ ] Remove or implement placeholder toasts
- [ ] Consider redirecting for access control instead of toasts

## Testing Toast Notifications

### Manual Testing

1. Test success scenarios - verify message appears and is clear
2. Test error scenarios - verify error message is user-friendly
3. Test validation - verify validation messages are actionable
4. Test edge cases - verify appropriate messages for all cases

### Automated Testing

```typescript
// Example test
it("shows success toast on successful creation", async () => {
  // Arrange
  const mockCreate = jest.fn().mockResolvedValue({ id: "1" });

  // Act
  await createItem(mockCreate);

  // Assert
  expect(toast.success).toHaveBeenCalledWith("Item created successfully");
});
```

## Related Files

- `lib/utils/errorHandler.ts` - Error handling utility
- `components/ui/sonner.tsx` - Toast component
- `app/layout.tsx` - Toast provider setup

## References

- Requirements: 15.4 (Form Validation & UX), 19.1 (Error Handling)
- Sonner Documentation: https://sonner.emilkowal.ski/
