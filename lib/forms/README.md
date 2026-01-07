# Form Management

This directory contains form utilities and helpers for React Hook Form integration.

## Overview

The form management system provides:

- **Validation Schemas**: Zod schemas for type-safe form validation
- **Form Helpers**: Utility functions for common form operations
- **Error Handling**: Centralized API error handling for forms

## Usage

### Basic Form with Validation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { handleFormApiError } from '@/lib/forms';

function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginApi(data);
      // Handle success
    } catch (error) {
      const message = handleFormApiError(error, setError);
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} />
      {errors.username && <span>{errors.username.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        Login
      </button>
    </form>
  );
}
```

### Using Form Helpers

```typescript
import {
  getErrorMessage,
  hasError,
  cleanFormData,
  scrollToFirstError,
} from "@/lib/forms";

// Get error message
const errorMsg = getErrorMessage(errors, "username");

// Check if field has error
const hasUsernameError = hasError(errors, "username");

// Clean form data before submission
const cleanedData = cleanFormData(formData);

// Scroll to first error
scrollToFirstError(errors);
```

### Date Handling

```typescript
import { formatDateForInput, parseDateFromInput } from "@/lib/forms";

// Format date for input field
const formattedDate = formatDateForInput(new Date());
// Returns: "2024-01-15"

// Parse date from input
const isoDate = parseDateFromInput("2024-01-15");
// Returns: "2024-01-15T00:00:00.000Z"
```

### File Upload

```typescript
import { toFormData } from "@/lib/forms";

const data = {
  title: "My Complaint",
  description: "Issue description",
  photos: [file1, file2],
};

const formData = toFormData(data);
// Ready to send as multipart/form-data
```

## Available Validation Schemas

### Authentication

- `loginSchema` - Login form validation

### Room Management

- `roomSchema` - Room creation/update
- `roomFilterSchema` - Room list filters

### Resident Management

- `residentOnboardingSchema` - Resident onboarding wizard
- `moveOutSchema` - Move-out process
- `residentFilterSchema` - Resident list filters

### Utility Management

- `utilityRecordSchema` - Utility meter recording
- `utilityFilterSchema` - Utility record filters

### Invoice Management

- `invoiceGenerationSchema` - Invoice generation
- `invoicePaymentStatusSchema` - Payment status update
- `invoiceFilterSchema` - Invoice list filters

### Laundry Management

- `laundryTransactionSchema` - Laundry transaction creation
- `laundryStatusUpdateSchema` - Status update
- `laundryPaymentUpdateSchema` - Payment status update
- `laundryFilterSchema` - Laundry transaction filters

### Complaint Management

- `complaintSchema` - Complaint submission
- `complaintStatusUpdateSchema` - Status update
- `complaintFilterSchema` - Complaint list filters

### Fridge Management

- `fridgeItemSchema` - Fridge item creation
- `fridgeItemUpdateSchema` - Quantity update

### Expense Management

- `expenseSchema` - Expense creation/update
- `expenseFilterSchema` - Expense list filters

## Form Helper Functions

### Error Handling

- `getErrorMessage(errors, fieldName)` - Get error message for field
- `hasError(errors, fieldName)` - Check if field has error
- `getFieldStateClasses(errors, fieldName)` - Get CSS classes for field state
- `getAllErrorMessages(errors)` - Get all error messages as array
- `scrollToFirstError(errors)` - Scroll to first error field

### Data Manipulation

- `cleanFormData(data)` - Remove empty strings and null values
- `toFormData(data)` - Convert to FormData for file uploads
- `formatDateForInput(date)` - Format date for input field
- `parseDateFromInput(dateString)` - Parse date from input field

### Form State

- `isFormDirty(dirtyFields)` - Check if form has unsaved changes
- `resetFormWithDefaults(reset, defaultValues)` - Reset form with defaults

### API Error Handling

- `handleFormApiError(error, setError)` - Handle API errors and set field errors
- `setServerError(setError, fieldName, message)` - Set server error on field
- `clearServerErrors(clearErrors)` - Clear all server errors
- `extractErrorMessage(error)` - Extract error message from unknown error
- `isValidationError(error)` - Check if error is validation error
- `isAuthError(error)` - Check if error is authentication error
- `isAuthorizationError(error)` - Check if error is authorization error
- `isNetworkError(error)` - Check if error is network error

## Best Practices

1. **Always use Zod schemas** for validation
2. **Handle API errors** with `handleFormApiError`
3. **Show loading states** during submission
4. **Disable submit button** while submitting
5. **Scroll to errors** for better UX
6. **Clean form data** before API submission
7. **Use TypeScript types** from schema inference
8. **Provide clear error messages** for users

## Example: Complete Form Component

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roomSchema, RoomFormData } from '@/lib/validations';
import {
  handleFormApiError,
  scrollToFirstError,
  cleanFormData,
} from '@/lib/forms';
import { useCreateRoom } from '@/lib/hooks/useRooms';
import { toast } from 'sonner';

export function RoomForm() {
  const createRoom = useCreateRoom();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      status: 'AVAILABLE',
      facilities: {},
    },
  });

  const onSubmit = async (data: RoomFormData) => {
    try {
      const cleanedData = cleanFormData(data);
      await createRoom.mutateAsync(cleanedData);
      toast.success('Room created successfully');
      // Redirect or reset form
    } catch (error) {
      const message = handleFormApiError(error, setError);
      toast.error(message);
      scrollToFirstError(errors);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="roomNumber">Room Number</label>
        <input
          id="roomNumber"
          {...register('roomNumber')}
          className={errors.roomNumber ? 'border-red-500' : ''}
        />
        {errors.roomNumber && (
          <span className="text-red-500 text-sm">
            {errors.roomNumber.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="rentalPrice">Rental Price</label>
        <input
          id="rentalPrice"
          type="number"
          {...register('rentalPrice', { valueAsNumber: true })}
          className={errors.rentalPrice ? 'border-red-500' : ''}
        />
        {errors.rentalPrice && (
          <span className="text-red-500 text-sm">
            {errors.rentalPrice.message}
          </span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Room'}
      </button>
    </form>
  );
}
```
