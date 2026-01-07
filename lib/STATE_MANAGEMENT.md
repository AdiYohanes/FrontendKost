# State Management Documentation

This document describes the state management setup for the Kost Management Frontend application.

## Overview

The application uses two complementary state management solutions:

1. **Zustand** - For global client-side state (auth, UI preferences)
2. **Tanstack Query** - For server state management (data fetching, caching, mutations)

## Zustand Stores

### Auth Store (`lib/stores/authStore.ts`)

Manages authentication state with persistence.

**State:**

- `user: User | null` - Current authenticated user
- `token: string | null` - JWT authentication token
- `isAuthenticated: boolean` - Authentication status

**Actions:**

- `login(user, token)` - Set user and token, mark as authenticated
- `logout()` - Clear all auth state and localStorage
- `checkAuth()` - Verify if user is authenticated
- `setUser(user)` - Update user information

**Usage:**

```typescript
import { useAuthStore } from "@/lib/stores";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  // Use the state and actions
}
```

**Persistence:**

- Stored in localStorage under key `auth-storage`
- Automatically rehydrates on app load

### UI Store (`lib/stores/uiStore.ts`)

Manages UI preferences and state.

**State:**

- `sidebarOpen: boolean` - Sidebar visibility state
- `theme: 'light' | 'dark' | 'system'` - Current theme

**Actions:**

- `toggleSidebar()` - Toggle sidebar open/closed
- `setSidebarOpen(open)` - Set sidebar state explicitly
- `setTheme(theme)` - Change theme and apply to DOM

**Usage:**

```typescript
import { useUIStore } from "@/lib/stores";

function MyComponent() {
  const { sidebarOpen, theme, toggleSidebar, setTheme } = useUIStore();

  // Use the state and actions
}
```

**Persistence:**

- Stored in localStorage under key `ui-storage`
- Theme is automatically applied to document root

## Tanstack Query

### Query Client (`lib/query/queryClient.ts`)

Configured with optimized defaults:

**Query Defaults:**

- `refetchOnWindowFocus: true` - Refetch when window regains focus
- `refetchOnReconnect: true` - Refetch when network reconnects
- `retry: 1` - Retry failed requests once
- `staleTime: 5 minutes` - Data considered fresh for 5 minutes
- `gcTime: 10 minutes` - Cache garbage collection after 10 minutes
- `refetchInterval: 5 minutes` - Background refetch every 5 minutes

**Mutation Defaults:**

- `retry: 1` - Retry failed mutations once

### Query Keys (`lib/query/queryKeys.ts`)

Organized query keys for all entities:

```typescript
import { queryKeys } from "@/lib/query";

// Examples:
queryKeys.rooms.all; // ['rooms']
queryKeys.rooms.detail("123"); // ['rooms', 'detail', '123']
queryKeys.residents.list({ status: "active" }); // ['residents', 'list', { status: 'active' }]
```

**Available Keys:**

- `auth` - Authentication queries
- `rooms` - Room management
- `residents` - Resident management
- `utilities` - Utility records
- `invoices` - Invoice management
- `laundry` - Laundry transactions
- `complaints` - Complaint tracking
- `fridge` - Fridge items
- `expenses` - Expense tracking
- `reports` - Financial reports

### Query Provider (`lib/query/QueryProvider.tsx`)

Wraps the application to provide query client context.

**Features:**

- Provides QueryClient to all components
- Includes React Query Devtools in development mode
- Already integrated in root layout

### Usage Examples

#### Fetching Data

```typescript
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { roomsApi } from '@/lib/api/services/rooms';

function RoomsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.rooms.all,
    queryFn: () => roomsApi.getAll(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render rooms */}</div>;
}
```

#### Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { roomsApi } from '@/lib/api/services/rooms';

function CreateRoomForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: roomsApi.create,
    onSuccess: () => {
      // Invalidate and refetch rooms list
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
    },
  });

  const handleSubmit = (data) => {
    mutation.mutate(data);
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

#### Optimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: roomsApi.update,
  onMutate: async (newRoom) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({
      queryKey: queryKeys.rooms.detail(newRoom.id),
    });

    // Snapshot previous value
    const previousRoom = queryClient.getQueryData(
      queryKeys.rooms.detail(newRoom.id)
    );

    // Optimistically update
    queryClient.setQueryData(queryKeys.rooms.detail(newRoom.id), newRoom);

    return { previousRoom };
  },
  onError: (err, newRoom, context) => {
    // Rollback on error
    queryClient.setQueryData(
      queryKeys.rooms.detail(newRoom.id),
      context?.previousRoom
    );
  },
  onSettled: (newRoom) => {
    // Refetch after error or success
    queryClient.invalidateQueries({
      queryKey: queryKeys.rooms.detail(newRoom.id),
    });
  },
});
```

## Custom Hooks

### useAuth Hook (`lib/hooks/useAuth.ts`)

Convenience hook for authentication operations.

**Features:**

- Combines auth store with router navigation
- Handles token storage in localStorage
- Provides logout with automatic redirect
- Includes `requireAuth()` for protected routes

**Usage:**

```typescript
import { useAuth } from '@/lib/hooks';

function MyComponent() {
  const { user, isAuthenticated, login, logout, requireAuth } = useAuth();

  // Check auth on mount
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  return <div>{user?.name}</div>;
}
```

## Best Practices

### When to Use Zustand vs Tanstack Query

**Use Zustand for:**

- Client-side only state (UI preferences, sidebar state)
- Authentication state (user, token)
- State that doesn't come from the server
- State that needs to persist across sessions

**Use Tanstack Query for:**

- Server data (rooms, residents, invoices, etc.)
- Data that needs caching
- Data that needs background refetching
- Mutations that affect server state

### Query Key Organization

Always use the predefined query keys from `lib/query/queryKeys.ts`:

```typescript
// ✅ Good
const { data } = useQuery({
  queryKey: queryKeys.rooms.detail(id),
  queryFn: () => roomsApi.getById(id),
});

// ❌ Bad
const { data } = useQuery({
  queryKey: ["rooms", id],
  queryFn: () => roomsApi.getById(id),
});
```

### Cache Invalidation

Invalidate queries after mutations to keep data fresh:

```typescript
const mutation = useMutation({
  mutationFn: roomsApi.create,
  onSuccess: () => {
    // Invalidate list to refetch
    queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
  },
});
```

### Error Handling

Always handle errors in queries and mutations:

```typescript
const { data, error } = useQuery({
  queryKey: queryKeys.rooms.all,
  queryFn: roomsApi.getAll,
});

if (error) {
  return <ErrorMessage error={error} />;
}
```

## Development Tools

### React Query Devtools

Available in development mode at the bottom of the screen:

- View all queries and their states
- Inspect query data and cache
- Manually trigger refetches
- Debug query behavior

### Zustand DevTools

To enable Zustand devtools, install the browser extension:

- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)

Then update stores to use devtools middleware (optional).

## Requirements Validation

This implementation satisfies:

- **Requirement 1.2**: JWT token storage and authentication state management
- **Requirement 14.1**: Real-time updates with automatic refetching and optimistic updates
- **Requirement 14.2**: Optimistic UI updates for mutations
- **Requirement 14.4**: Loading states with query status

## Next Steps

1. Create API service files in `lib/api/services/`
2. Create custom hooks for each entity (useRooms, useResidents, etc.)
3. Implement authentication flow with login/logout
4. Add error handling and toast notifications
5. Implement protected route middleware
