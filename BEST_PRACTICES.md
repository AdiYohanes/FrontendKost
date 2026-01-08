# Best Practices Implementation

This document outlines the best practices implemented in the Kost Management Frontend project.

## 1. Code Organization

### Directory Structure

```
lib/
├── api/              # API client and services
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── constants/        # Application constants
├── validations/      # Zod validation schemas
├── query/            # Tanstack Query configuration
└── stores/           # Zustand state management
```

### Separation of Concerns

- **API Layer**: Isolated in `lib/api/services/`
- **Business Logic**: Custom hooks in `lib/hooks/`
- **UI Components**: Reusable components in `components/`
- **Pages**: Route-specific components in `app/`

## 2. Type Safety

### TypeScript Best Practices

- ✅ Strict type checking enabled
- ✅ No `any` types (except for known library compatibility issues)
- ✅ Proper interface definitions for all data structures
- ✅ Type inference where possible

### Example

```typescript
// Good: Proper typing
interface RoomFormProps {
  room?: Room;
  onSubmit: (data: RoomFormData) => void;
  isSubmitting?: boolean;
}

// Avoid: Using any
// const handleError = (error: any) => { ... }

// Better: Proper error typing
const handleError = (error: unknown) => {
  const message = getErrorMessage(error);
  toast.error(message);
};
```

## 3. Error Handling

### Centralized Error Handler

- Created `lib/utils/errorHandler.ts` for consistent error handling
- Extracts user-friendly messages from API errors
- Type-safe error handling

### Usage

```typescript
import { getErrorMessage } from "@/lib/utils/errorHandler";

try {
  await someApiCall();
} catch (error) {
  toast.error(getErrorMessage(error));
}
```

## 4. Constants Management

### Magic Numbers Elimination

- All magic numbers moved to constants files
- Example: `ITEMS_PER_PAGE` in `lib/constants/pagination.ts`

### Benefits

- Easy to maintain
- Single source of truth
- Better code readability

## 5. Utility Functions

### Reusable Utilities

Created utility functions for common operations:

#### Room Utilities (`lib/utils/roomUtils.ts`)

- `getRoomStatusColor()`: Status badge styling
- `formatFacilityKey()`: Format facility names
- `formatCurrency()`: Indonesian Rupiah formatting

### Benefits

- DRY (Don't Repeat Yourself)
- Consistent behavior across the app
- Easy to test and maintain

## 6. React Best Practices

### Custom Hooks

- Encapsulate data fetching logic
- Reusable across components
- Example: `useRooms()`, `useRoom()`, `useCreateRoom()`

### Component Composition

- Small, focused components
- Reusable UI components in `components/ui/`
- Form components separated from pages

### State Management

- Local state with `useState` for UI state
- Zustand for global state
- Tanstack Query for server state

## 7. Performance Optimization

### Optimistic Updates

Implemented in all mutations for better UX:

```typescript
onMutate: async (newData) => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ queryKey });

  // Snapshot previous value
  const previous = queryClient.getQueryData(queryKey);

  // Optimistically update
  queryClient.setQueryData(queryKey, newData);

  return { previous };
},
onError: (err, variables, context) => {
  // Rollback on error
  queryClient.setQueryData(queryKey, context.previous);
}
```

### Memoization

- `useMemo` for expensive computations
- Proper dependency arrays

## 8. Form Handling

### React Hook Form + Zod

- Schema-based validation
- Type-safe forms
- Automatic error handling

### Example

```typescript
const form = useForm<RoomFormData>({
  resolver: zodResolver(roomSchema),
  defaultValues,
});
```

## 9. API Integration

### Axios Configuration

- Centralized API client
- Request/response interceptors
- Automatic token injection
- Error handling

### Service Pattern

Each resource has its own service file:

- `roomsApi.getAll()`
- `roomsApi.getById(id)`
- `roomsApi.create(data)`
- `roomsApi.update(id, data)`
- `roomsApi.delete(id)`

## 10. UI/UX Best Practices

### Feedback Mechanisms

- ✅ Loading states (skeletons, spinners)
- ✅ Success/error toasts
- ✅ Confirmation dialogs for destructive actions
- ✅ Optimistic UI updates

### Accessibility

- Semantic HTML
- Proper ARIA labels
- Keyboard navigation support
- Focus management

### Responsive Design

- Mobile-first approach
- Tailwind CSS utilities
- Responsive breakpoints

## 11. Code Quality

### Naming Conventions

- **Components**: PascalCase (`RoomForm.tsx`)
- **Hooks**: camelCase with `use` prefix (`useRooms.ts`)
- **Utilities**: camelCase (`errorHandler.ts`)
- **Constants**: UPPER_SNAKE_CASE (`ITEMS_PER_PAGE`)

### File Organization

- One component per file
- Related files grouped together
- Clear import/export structure

### Comments

- JSDoc comments for functions
- Inline comments for complex logic
- Type annotations as documentation

## 12. Testing Readiness

### Testable Code

- Pure functions in utilities
- Separated business logic from UI
- Dependency injection ready
- Mock-friendly API layer

## 13. Security

### Best Practices Implemented

- ✅ JWT token in localStorage (with automatic cleanup)
- ✅ Automatic logout on 401
- ✅ CSRF protection via axios
- ✅ Input validation (client + server)
- ✅ XSS prevention (React's built-in escaping)

## 14. Dependency Management

### Clean Dependencies

- Removed unused packages (`next-themes`)
- Only production-necessary dependencies
- Regular dependency audits

### Current Dependencies

All dependencies are actively used:

- `@tanstack/react-query`: Server state management
- `axios`: HTTP client
- `react-hook-form`: Form handling
- `zod`: Schema validation
- `zustand`: Global state
- `sonner`: Toast notifications
- `lucide-react`: Icons
- `@radix-ui/*`: Accessible UI primitives

## 15. Git Best Practices

### Commit Messages

- Clear, descriptive messages
- Reference task numbers
- Explain "why" not just "what"

### Branch Strategy

- Feature branches for new features
- Regular commits
- Clean commit history

## Summary

This codebase follows modern React and TypeScript best practices:

- ✅ Type-safe throughout
- ✅ Proper error handling
- ✅ Optimistic UI updates
- ✅ Reusable components and utilities
- ✅ Clean code organization
- ✅ Performance optimized
- ✅ Accessible and responsive
- ✅ Maintainable and scalable

All code is production-ready and follows industry standards.
